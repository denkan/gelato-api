import { GelatoApi } from '../src/gelato-api';
import { GelatoApiInterfaces as I } from '../src/interfaces';

require('dotenv').config(); // utilize .env file
const apiKey = process.env.GELATO_API_KEY;

if (!apiKey) {
  throw 'No environment variable for GELATO_API_KEY defined';
}

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    expect(apiFaulty.products.getCatalogs()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    let cats1: I.ListResponse<I.ProductCatalog>;
    let cats2: I.ListResponse<I.ProductCatalog>;
    const prodUids: string[] = [];

    it('should get catalogs', async () => {
      cats1 = await api.products.getCatalogs();
      expect(cats1?.data?.length).toBeGreaterThan(0);
    });
    it('should get catalogs with limit/offset params', async () => {
      cats2 = await api.products.getCatalogs({ limit: 3, offset: 2 });
      expect(cats2.data.length).toBe(3);
      expect(cats2.data.length).toBeLessThan(cats1.data.length);
      expect(cats2.data[0]).not.toEqual(cats1.data[0]);
      expect(cats2.data[0]).toEqual(cats1.data[2]);
    });

    it('should get specific catalog', async () => {
      const cat1 = cats1.data[0];
      const cat = await api.products.getCatalog(cat1.catalogUid);
      expect(cat.catalogUid).toBe(cat1.catalogUid);
      expect(cat.title).toBe(cat1.title);
    });

    it('should get products in specific catalog', async () => {
      const cat1 = cats1.data[0];
      const s1 = await api.products.getProductsInCatalog(cat1.catalogUid);
      const s2 = await api.products.getProductsInCatalog(cat1.catalogUid, { limit: 1, offset: 1 });
      const s3 = await api.products.getProductsInCatalog(cat1.catalogUid, {
        attributeFilters: { DummyAttr: ['that', 'doesnt', 'exists'] },
      });
      expect(s1.products?.length).toBeGreaterThan(0);
      expect(s2.products?.length).toBeLessThan(s1.products.length);
      expect(s2.products?.length).toBe(1);
      expect(s3.products?.length).toBe(0);

      // save for future test cases
      s1.products.forEach((p) => prodUids.push(p.productUid));
    });

    it('should get specific product', async () => {
      const prod = await api.products.getProduct(prodUids[0]);
      expect(prod).toBeDefined();
      expect(prod.productUid).toBeDefined();
    });

    it('should get cover dimensions for specific product', async () => {
      const id =
        'photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver';
      const cd = await api.products.getCoverDimensions(id, { pageCount: 100 });
      expect(cd).toBeDefined();
    });

    it('should get prices for specific product', async () => {
      const prices1 = await api.products.getPrices(prodUids[0]);
      const prices2 = await api.products.getPrices(prodUids[0], { country: 'SE', currency: 'SEK' });
      expect(Array.isArray(prices1)).toBe(true);
      expect(Array.isArray(prices2)).toBe(true);
      expect(prices1.length).toBeGreaterThan(0);
      expect(prices2.length).toBeGreaterThan(0);
      expect(prices1[0].productUid).toBe(prices2[0].productUid);
      expect(prices1[0].country).not.toBe(prices2[0].country);
      expect(prices1[0].currency).not.toBe(prices2[0].currency);
    });

    it('should get stock availability for specific products', async () => {
      const productUids = prodUids.slice(0, 3);
      const stock = await api.products.getStockAvailability(productUids);
      expect(productUids.length).toBe(3);
      expect(stock?.productsAvailability.length).toBe(3);
      expect(stock?.productsAvailability[0].availability.length).toBeGreaterThan(0);
    });
  });

  describe('Shipment', () => {
    it('should get shipment methods', async () => {
      const r = await api.shipment.getMethods();
      expect(r?.shipmentMethods?.length).toBeGreaterThan(0);
      expect(r?.shipmentMethods[0]?.shipmentMethodUid).toBeDefined();
      expect(r?.shipmentMethods[0]?.name).toBeDefined();
      expect(['normal', 'express', 'pallet']).toContain(r?.shipmentMethods[0]?.type);
      expect(Array.isArray(r?.shipmentMethods[0]?.supportedCountries)).toBe(true);
    });
  });

  describe('Orders', () => {
    const testOrder: I.OrderCreateRequest = {
      orderType: 'draft',
      orderReferenceId: 'DUMMY-ORDER-FOR-TEST',
      customerReferenceId: 'DUMMY-CUSTOMER-FOR-TEST',
      currency: 'EUR',
      items: [
        {
          itemReferenceId: 'DUMMY-ITEM-FOR-TEST',
          productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
          quantity: 1,
          fileUrl: 'https://i1.sndcdn.com/artworks-000398776953-cwfbd0-t500x500.jpg',
        },
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Testson',
        addressLine1: 'Test Street 123',
        city: 'Testville',
        postCode: '123 45',
        country: 'SE',
        email: 'test@example.com',
      },
    };
    let createdOrder: I.Order;

    it('should create order', async () => {
      const o = await api.orders.v3.create(testOrder);
      const testOrderProps = ['orderType', 'orderReferenceId', 'customerReferenceId', 'currency'];
      const testShippingProps = Object.keys(testOrder.shippingAddress);
      expect(o?.id).toBeDefined();
      // @ts-ignore
      testOrderProps.forEach((p) => expect(o[p]).toBe(testOrder[p]));
      // @ts-ignore
      testShippingProps.forEach((p) => expect(o.shippingAddress[p]).toBe(testOrder.shippingAddress[p]));
      expect(o.shipment).toBeDefined();
      expect(o.items.length).toBe(testOrder.items.length);
      expect(o.receipts.length).toBeGreaterThan(0);

      await expect(
        api.orders.v3.create({ myInvalid: 'dummy-order' } as unknown as I.OrderCreateRequest),
      ).rejects.toThrow();

      // save for future test cases
      createdOrder = o;
    });

    it('should get order', async () => {
      const fetchedOrder = await api.orders.v3.get(createdOrder.id);
      expect(fetchedOrder.id).toBe(createdOrder.id);

      await expect(api.orders.v3.get('INVALID-ORDER-ID')).rejects.toThrow();
    });

    it('should update order', async () => {
      const updatedOrder = await api.orders.v3.update({ ...createdOrder, customerReferenceId: 'CUSTOMER-REF-CHANGED' });
      expect(updatedOrder.customerReferenceId).toBe('CUSTOMER-REF-CHANGED');

      await expect(api.orders.v3.update({} as I.Order)).rejects.toThrow();
    });

    it('should delete draft order', async () => {
      await expect(api.orders.v3.deleteDraft(createdOrder.id)).resolves.not.toThrow();
      await expect(api.orders.v3.deleteDraft('INVALID-ORDER-ID')).rejects.toThrow();

      // createdOrder is now deleted...
    });

    it('should patch draft order', async () => {
      // ... create order once again
      createdOrder = await api.orders.v3.create(testOrder);

      const patchedOrder = await api.orders.v3.patchDraft(createdOrder.id, {
        orderReferenceId: 'this shouldnt change',
        orderType: 'order',
      } as any);
      expect(patchedOrder).toBeDefined();
      expect(patchedOrder.orderType).toBe('order');
      expect(patchedOrder.orderReferenceId).toBe(testOrder.orderReferenceId);

      await expect(api.orders.v3.patchDraft('INVALID-ORDER-ID', { orderType: 'order' })).rejects.toThrow();
    });

    it('should cancel order', async () => {
      await expect(api.orders.v3.cancel(createdOrder.id)).resolves.not.toThrow();
      await expect(api.orders.v3.cancel('INVALID-ORDER-ID')).rejects.toThrow();
    });

    it('should search orders', async () => {
      // FYI: createdOrder does exists as cancelled

      const [s1, s2, s3, s4] = await Promise.all([
        api.orders.v3.search({
          orderReferenceIds: [testOrder.orderReferenceId],
        }),
        api.orders.v3.search({
          search: 'test',
        }),
        api.orders.v3.search({
          countries: [testOrder.shippingAddress.country],
        }),
        api.orders.v3.search({
          orderReferenceId: 'INVALID-ORDER-REF-ID',
        }),
      ]);
      expect(s1.orders.length).toBeGreaterThan(0);
      expect(s2.orders.length).toBeGreaterThan(0);
      expect(s3.orders.length).toBeGreaterThan(0);
      expect(s4.orders.length).toBe(0);
    });

    it('should quote order', async () => {
      const testQuote: I.OrderQuoteRequest = {
        orderReferenceId: 'DUMMY-ORDER-FOR-TEST',
        customerReferenceId: 'DUMMY-CUSTOMER-FOR-TEST',
        currency: 'EUR',
        products: [
          {
            itemReferenceId: 'DUMMY-ITEM-FOR-TEST',
            productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
            quantity: 1,
            fileUrl: 'https://i1.sndcdn.com/artworks-000398776953-cwfbd0-t500x500.jpg',
          },
        ],
        recipient: {
          firstName: 'Test',
          lastName: 'Testson',
          addressLine1: 'Test Street 123',
          city: 'Testville',
          postCode: '123 45',
          country: 'SE',
          email: 'test@example.com',
        },
      };
      const q = await api.orders.v3.quote(testQuote);
      expect(q).toBeDefined();
      // expect(q.orderReferenceId).toBe(testQuote.orderReferenceId); // Why does Gelato generate own orderReferenceId?!
      expect(q.quotes.length).toBeGreaterThan(0);
      expect(q.quotes[0].itemReferenceIds).toContain(testQuote.products[0].itemReferenceId);
      expect(q.quotes[0].fulfillmentCountry).toBeDefined();
      expect(q.quotes[0].products.length).toBeGreaterThan(0);
      expect(q.quotes[0].products[0].currency).toBe(testQuote.currency);
      expect(q.quotes[0].shipmentMethods.length).toBeGreaterThan(0);
      expect(q.quotes[0].shipmentMethods[0].currency).toBe(testQuote.currency);
    });

    it('should NOT delete non-draft order', async () => {
      await expect(api.orders.v3.deleteDraft(createdOrder.id)).rejects.toThrow();
    });
    it('should patch order back to draft', async () => {
      await expect(api.orders.v3.patchDraft(createdOrder.id, { orderType: 'draft' })).resolves.not.toThrow();

      // FYI: we do this here to be able to change shipping address below
    });

    it('should get order shipping address', async () => {
      const sa = await api.orders.v3.getShippingAddress(createdOrder.id);
      const testProps = Object.keys(testOrder.shippingAddress);
      // @ts-ignore
      testProps.forEach((p) => expect(sa[p]).toEqual(testOrder.shippingAddress[p]));
    });

    it('should update order shipping address', async () => {
      const newAddress: I.OrderShippingAddress = {
        firstName: 'Beta',
        lastName: 'Tester',
        addressLine1: 'New Street 999',
        city: 'BetaTown',
        postCode: '987 65',
        country: 'SE', // FYI: country change isnt allowed
        email: 'beta@example.com',
      };
      const sa = await api.orders.v3.updateShippingAddress(createdOrder.id, newAddress);
      const testProps = Object.keys(newAddress);
      // @ts-ignore
      testProps.forEach((p) => expect(sa[p]).toEqual(newAddress[p]));

      await expect(api.orders.v3.updateShippingAddress('INVALID-ORDER-ID', newAddress)).rejects.toThrow();
    });

    it('should clean up order by deleting draft', async () => {
      await expect(api.orders.v3.deleteDraft(createdOrder.id)).resolves.not.toThrow();
    });
  });
});

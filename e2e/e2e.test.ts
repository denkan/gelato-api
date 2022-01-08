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

      // save product uids for later test cases
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
});

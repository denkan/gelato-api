import { GelatoApi } from '../src';
import { GelatoListResponse } from '../src/base';
import { GelatoProductCatalog } from '../src/product/catalog';

require('dotenv').config(); // utilize .env file
const apiKey = process.env.GELATO_API_KEY;

if (!apiKey) {
  throw 'No environment variable for GELATO_API_KEY defined';
}

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    expect(apiFaulty.product.catalog.list()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    describe('Catalog', () => {
      let list1: GelatoListResponse<GelatoProductCatalog>;
      let list2: GelatoListResponse<GelatoProductCatalog>;
      it('should fetch catalogs', async () => {
        list1 = await api.product.catalog.list();
        expect(list1?.data?.length).toBeGreaterThan(0);
      });
      it('should fetch catalogs with limit/offset params', async () => {
        list2 = await api.product.catalog.list({ limit: 3, offset: 2 });
        expect(list2.data.length).toBe(3);
        expect(list2.data.length).toBeLessThan(list1.data.length);
        expect(list2.data[0]).not.toEqual(list1.data[0]);
        expect(list2.data[0]).toEqual(list1.data[2]);
      });
      it('should fetch specific catalog', async () => {
        const listItem1 = list1.data[0];
        const cat1 = await api.product.catalog.get(listItem1.catalogUid);
        expect(cat1.catalogUid).toBe(listItem1.catalogUid);
        expect(cat1.title).toBe(listItem1.title);
      });
    });
  });
});

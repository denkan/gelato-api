import { GelatoApi } from '../src/gelato-api';
import { GelatoListResponse } from '../src/base';
import { GelatoProductCatalog } from '../src/products/products';

require('dotenv').config(); // utilize .env file
const apiKey = process.env.GELATO_API_KEY;

if (!apiKey) {
  throw 'No environment variable for GELATO_API_KEY defined';
}

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    expect(apiFaulty.product.listCatalogs()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    let cats1: GelatoListResponse<GelatoProductCatalog>;
    let cats2: GelatoListResponse<GelatoProductCatalog>;
    let cats1Item1: GelatoProductCatalog;

    it('should list catalogs', async () => {
      cats1 = await api.product.listCatalogs();
      expect(cats1?.data?.length).toBeGreaterThan(0);
    });
    it('should list catalogs with limit/offset params', async () => {
      cats2 = await api.product.listCatalogs({ limit: 3, offset: 2 });
      expect(cats2.data.length).toBe(3);
      expect(cats2.data.length).toBeLessThan(cats1.data.length);
      expect(cats2.data[0]).not.toEqual(cats1.data[0]);
      expect(cats2.data[0]).toEqual(cats1.data[2]);
    });

    it('should get specific catalog', async () => {
      const cat1 = cats1.data[0];
      const cat = await api.product.getCatalog(cat1.catalogUid);
      expect(cat.catalogUid).toBe(cat1.catalogUid);
      expect(cat.title).toBe(cat1.title);
    });

    it('should search products in specific catalog', async () => {
      const cat1 = cats1.data[0];
      const s1 = await api.product.searchProductsInCatalog(cat1.catalogUid);
      const s2 = await api.product.searchProductsInCatalog(cat1.catalogUid, { limit: 1, offset: 1 });
      const s3 = await api.product.searchProductsInCatalog(cat1.catalogUid, {
        attributeFilters: { DummyAttr: ['that', 'doesnt', 'exists'] },
      });
      expect(s1.products?.length).toBeGreaterThan(0);
      expect(s2.products?.length).toBeLessThan(s1.products.length);
      expect(s2.products?.length).toBe(1);
      expect(s3.products?.length).toBe(0);
    });
  });
});

import axios, { Axios } from 'axios';
import { GelatoApi } from '../src';

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
      it('should fetch catalogs', async () => {
        const r = await api.product.catalog.list();
        expect(r?.data?.length).toBeGreaterThan(0);
      });
      it('should support limit/offset params', async () => {
        const r1 = await api.product.catalog.list();
        const r2 = await api.product.catalog.list({ limit: 3, offset: 2 });
        expect(r2.data.length).toBe(3);
        expect(r2.data.length).toBeLessThan(r1.data.length);
        expect(r2.data[0]).not.toEqual(r1.data[0]);
        expect(r2.data[0]).toEqual(r1.data[2]);
      });
    });
  });
});

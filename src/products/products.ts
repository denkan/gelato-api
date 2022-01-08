import { GelatoApiBase } from '../base';
import { Gelato as I } from '../types';

export class GelatoProductApi extends GelatoApiBase {
  static baseUrl = 'https://product.gelatoapis.com/v3';

  constructor(config: I.Config) {
    super(config);
  }

  getCatalogs(params?: { offset?: number; limit?: number }): Promise<I.ListResponse<I.ProductCatalog>> {
    return this.handleResponse(this.axios.get('/catalogs', { params }));
  }

  getCatalog(catalogUid: string): Promise<I.ProductCatalog> {
    return this.handleResponse(this.axios.get(`/catalogs/${catalogUid}`));
  }

  getProductsInCatalog(
    catalogUid: string,
    params?: {
      offset?: number;
      limit?: number;
      attributeFilters?: { [name: string]: string[] };
    },
  ): Promise<{
    products: I.ProductSearch[];
    hits: { attributeHits: { [attributeName: string]: { [attributeValue: string]: number } } };
  }> {
    return this.handleResponse(this.axios.post(`/catalogs/${catalogUid}/products:search`, params));
  }

  getProduct(productUid: string): Promise<I.Product> {
    return this.handleResponse(this.axios.get(`/products/${productUid}`));
  }

  getCoverDimensions(
    productUid: string,
    params: { pageCount: number },
  ): Promise<{ products: I.ProductCoverDimension[] }> {
    return this.handleResponse(this.axios.get(`/products/${productUid}/cover-dimensions`, { params }));
  }

  getPrices(
    productUid: string,
    params?: { country?: string; currency?: string; pageCount?: number },
  ): Promise<I.ProductPrice[]> {
    return this.handleResponse(this.axios.get(`/products/${productUid}/prices`, { params }));
  }

  getStockAvailability(products: string[]): Promise<{ productsAvailability: I.ProductAvailability[] }> {
    return this.handleResponse(this.axios.post(`/stock/region-availability`, { products }));
  }
}

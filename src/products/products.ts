import { GelatoApiBase } from '../base';
import { GelatoApiInterfaces as I } from '../interfaces';

export class GelatoProductApi extends GelatoApiBase {
  static baseUrl = 'https://product.gelatoapis.com/v3';

  constructor(config: I.Config) {
    super(config);
  }

  listCatalogs(params?: { offset?: number; limit?: number }): Promise<I.ListResponse<I.ProductCatalog>> {
    return this.handleResponse(this.axios.get('/catalogs', { params }));
  }

  getCatalog(catalogUid: string): Promise<I.ProductCatalog> {
    return this.handleResponse(this.axios.get(`/catalogs/${catalogUid}`));
  }

  searchProductsInCatalog(
    catalogUid: string,
    params?: {
      offset?: number;
      limit?: number;
      attributeFilters?: { [name: string]: string[] };
    },
  ): Promise<{ products: I.Product[] }> {
    return this.handleResponse(this.axios.post(`/catalogs/${catalogUid}/products:search`, params));
  }

  getProduct(productUid: string): Promise<{ products: I.Product[] }> {
    return this.handleResponse(this.axios.get(`/products/${productUid}`));
  }

  getProductCoverDimensions(productUid: string, pageCount: number): Promise<{ products: I.Product[] }> {
    return this.handleResponse(this.axios.get(`/products/${productUid}/cover-dimensions`, { params: { pageCount } }));
  }
}

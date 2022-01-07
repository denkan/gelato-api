import { GelatoApiBase, GelatoApiConfig, GelatoApiListResponse } from '../base';

export class GelatoProductCatalogApi extends GelatoApiBase {
  static baseUrl = 'https://product.gelatoapis.com/v3/catalogs';

  constructor(config: GelatoApiConfig) {
    super(config);
  }

  list(params?: { offset?: number; limit?: number }): Promise<GelatoApiListResponse<GelatoProductCatalog>> {
    return this.handleResponse(this.axios.get<GelatoApiListResponse<GelatoProductCatalog>>('/', { params }));
  }
}

export interface GelatoProductCatalog {
  catalogUid: string;
  title: string;
}

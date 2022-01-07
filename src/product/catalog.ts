import { GelatoApiBase, GelatoApiConfig, GelatoListResponse } from '../base';

export class GelatoProductCatalogApi extends GelatoApiBase {
  static baseUrl = 'https://product.gelatoapis.com/v3/catalogs';

  constructor(config: GelatoApiConfig) {
    super(config);
  }

  list(params?: { offset?: number; limit?: number }): Promise<GelatoListResponse<GelatoProductCatalog>> {
    return this.handleResponse(this.axios.get<GelatoListResponse<GelatoProductCatalog>>('/', { params }));
  }

  get(catalogUid: string): Promise<GelatoProductCatalog> {
    return this.handleResponse(this.axios.get<GelatoProductCatalog>(catalogUid));
  }
}

export interface GelatoProductCatalog {
  catalogUid: string;
  title: string;
  productAttributes: GelatoProductAttribute[];
}
export interface GelatoProductAttribute {
  productAttributeUid: string;
  title: string;
  values: GelatoProductAttributeValue[];
}
export interface GelatoProductAttributeValue {
  productAttributeValueUid: string;
  title: string;
}

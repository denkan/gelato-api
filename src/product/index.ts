import { GelatoApiBase, GelatoApiConfig } from '../base';
import { GelatoProductCatalogApi } from './catalog';

export class GelatoProductApi extends GelatoApiBase {
  constructor(config: GelatoApiConfig) {
    super(config);
  }

  readonly catalog = new GelatoProductCatalogApi(this.config);
}

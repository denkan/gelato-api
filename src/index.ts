import { GelatoApiBase, GelatoApiConfig } from './base';
import { GelatoProductApi } from './product';

export class GelatoApi extends GelatoApiBase {
  constructor(config: GelatoApiConfig) {
    super(config);
  }

  readonly product = new GelatoProductApi(this.config);
}

import { GelatoApiBase } from './base';
import { GelatoApiInterfaces as I } from './interfaces';
import { GelatoProductApi } from './products/products';

export class GelatoApi extends GelatoApiBase {
  constructor(config: I.Config) {
    super(config);
  }

  readonly product = new GelatoProductApi(this.config);
}

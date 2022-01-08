import { GelatoOrdersV3Api } from './orders-v3';
import { GelatoApiBase } from '../base';
import { GelatoApiInterfaces as I } from '../interfaces';

export class GelatoOrdersApi extends GelatoApiBase {
  constructor(config: I.Config) {
    super(config);
  }

  readonly v3 = new GelatoOrdersV3Api(this.config);
}

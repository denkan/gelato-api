import { GelatoApiBase } from '../base';
import { GelatoApiInterfaces as I } from '../interfaces';

export class GelatoShipmentApi extends GelatoApiBase {
  static baseUrl = 'https://shipment.gelatoapis.com/v1';

  constructor(config: I.Config) {
    super(config);
  }

  getMethods(params?: { country?: string }): Promise<{ shipmentMethods: I.ShipmentMethod[] }> {
    return this.handleResponse(this.axios.get('/shipment-methods', { params }));
  }
}

import { GelatoApiBase } from '../base';
import { Gelato as I } from '../types';

export class GelatoOrdersV3Api extends GelatoApiBase {
  static baseUrl = 'https://order.gelatoapis.com/v3/orders';

  constructor(config: I.Config) {
    super(config);
  }

  create(order: I.OrderCreateRequest): Promise<I.Order> {
    return this.handleResponse(this.axios.post('/', order));
  }

  get(orderId: string): Promise<I.Order> {
    return this.handleResponse(this.axios.get(orderId));
  }

  update(order: I.Order): Promise<I.Order> {
    return this.handleResponse(this.axios.put(order.id, order));
  }

  deleteDraft(orderId: string): Promise<void> {
    return this.handleResponse(this.axios.delete(orderId));
  }

  patchDraft(orderId: string, params: { orderType: I.OrderType }): Promise<I.Order> {
    return this.handleResponse(this.axios.patch(orderId, params));
  }

  cancel(orderId: string): Promise<void> {
    return this.handleResponse(this.axios.post(`${orderId}:cancel`));
  }

  search(params: I.OrderSearchRequest): Promise<{ orders: I.OrderSearch[] }> {
    return this.handleResponse(this.axios.post(`${GelatoOrdersV3Api.baseUrl}:search`, params));
  }

  quote(params: I.OrderQuoteRequest): Promise<{ orderReferenceId: string; quotes: I.OrderQuote[] }> {
    return this.handleResponse(this.axios.post(`${GelatoOrdersV3Api.baseUrl}:quote`, params));
  }

  getShippingAddress(orderId: string): Promise<I.OrderShippingAddress> {
    return this.handleResponse(this.axios.get(`${orderId}/shipping-address`));
  }

  updateShippingAddress(orderId: string, params: I.OrderShippingAddress): Promise<I.OrderShippingAddress> {
    return this.handleResponse(this.axios.put(`${orderId}/shipping-address`, params));
  }
}

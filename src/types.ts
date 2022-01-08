export namespace Gelato {
  export interface Config {
    apiKey: string;
  }

  export interface ListResponse<T> {
    data: T[];
    pagination: { total: number; offset: number };
  }

  export interface ProductCatalog {
    catalogUid: string;
    title: string;
    productAttributes: ProductAttribute[];
  }
  export interface ProductAttribute {
    productAttributeUid: string;
    title: string;
    values: ProductAttributeValue[];
  }
  export interface ProductAttributeValue {
    productAttributeValueUid: string;
    title: string;
  }
  export interface MeasureUnit {
    value: number;
    measureUnit: string;
  }
  interface ProductBase {
    productUid: string;
    attributes: { [name: string]: string };
    weight: MeasureUnit;
    supportedCountries: string[];
  }
  export interface Product extends ProductBase {
    notSupportedCountries: string[];
    isStockable: boolean;
    isPrintable: boolean;
    validPageCounts?: number[];
  }
  export interface ProductSearch extends ProductBase {
    dimensions: {
      Width?: MeasureUnit;
      Height?: MeasureUnit;
      Thickness?: MeasureUnit;
      [size: string]: MeasureUnit | undefined;
    };
  }

  export interface ProductCoverDimension {
    productUid: string;
    pageCount: number;
    measureUnit: string;
    wraparoundInsideSize?: ProductDimensionAttribute;
    wraparoundEdgeSize?: ProductDimensionAttribute;
    contentBackSize?: ProductDimensionAttribute;
    jointBackSize?: ProductDimensionAttribute;
    spineSize?: ProductDimensionAttribute;
    jointFrontSize?: ProductDimensionAttribute;
    contentFrontSize?: ProductDimensionAttribute;
    bleedSize?: ProductDimensionAttribute;
  }
  export interface ProductDimensionAttribute {
    width: number;
    height: number;
    left: number;
    top: number;
    thickness?: number;
  }
  export interface ProductPrice {
    productUid: string;
    country: string;
    currency: string;
    quantity: number;
    price: number;
    pageCount?: number;
  }
  export interface ProductAvailability {
    productUid: string;
    availability: Availability[];
  }
  export interface Availability {
    stockRegionUid: string;
    status: AvailabilityStatus;
    replenishmentDate?: string;
  }
  export type AvailabilityStatus =
    | 'in-stock'
    | 'out-of-stock-replenishable'
    | 'out-of-stock'
    | 'non-stockable'
    | 'not-supported';

  export interface ShipmentMethod {
    shipmentMethodUid: string;
    type: ShipmentType;
    name: string;
    isBusiness: boolean;
    isPrivate: boolean;
    hasTracking: boolean;
    supportedCountries: string[];
  }

  export type ShipmentType = 'normal' | 'express' | 'pallet';

  export type OrderType = 'draft' | 'order';

  export type OrderFulfillmentStatus =
    | 'created'
    | 'passed'
    | 'failed'
    | 'canceled'
    | 'printed'
    | 'shipped'
    | 'draft'
    | 'pending_approval'
    | 'not_connected'
    | 'on_hold';

  export type OrderFinancialStatus =
    | 'created'
    | 'passed'
    | 'failed'
    | 'canceled'
    | 'printed'
    | 'shipped'
    | 'draft'
    | 'pending_approval'
    | 'not_connected'
    | 'on_hold';

  export interface OrderCreateRequest {
    /** Default: 'order' */
    orderType?: OrderType;
    orderReferenceId: string;
    customerReferenceId: string;
    currency: string;
    shipmentMethodUid?: ShipmentType | string;
    items: OrderItemRequest[];
    /** Max number of entries: 20 */
    metadata?: Metadata[];
    shippingAddress: OrderShippingAddress;
    returnAddress?: OrderReturnAddress;
    // -- Additional props found in actual response:
    storeId?: string;
  }
  export interface Order extends OrderCreateRequest {
    id: string;
    orderType: OrderType;
    fulfillmentStatus: OrderFulfillmentStatus;
    financialStatus: OrderFinancialStatus;
    channel: string;
    createdAt: string;
    updatedAt: string;
    orderedAt: string;
    items: OrderItem[];
    shipment?: OrderShipment;
    billingEntity?: OrderBillingEntity;
    shippingAddress: OrderShippingAddress;
    receipts: OrderReceipt[];
    // -- Additional props found in actual response:
    receiptsIds?: string[];
    refusalReason?: string;
    orderedByUserId?: string;
    retailCurrency?: string;
    paymentMethodType?: string;
    paymentMethodId?: string;
    connectedOrderIds?: string[];
    // @ts-ignore
    discounts?: any[];
  }
  export interface OrderItemRequest {
    itemReferenceId: string;
    productUid: string;
    quantity: number;
    pageCount?: number;
    fileUrl?: string;
  }
  export interface OrderItem extends OrderItemRequest {
    id: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    fileUrl: string;
    processedFileUrl: string;
    previews: OrderItemPreview[];
    options: OrderItemOptions[];
    // -- Additional props found in actual response:
    category?: string;
    productCategoryUid?: string;
    productTypeUid?: string;
    productNameUid?: string;
    productName?: string;
    // @ts-ignore
    printJobs?: any[];
    // @ts-ignore
    eventLog?: any[];
    metadata?: Metadata[];
    attributes?: OrderItemAttribute[];
    designId?: string;
    productFileMimeType?: string;
    finalProductUid?: string;
    retailPriceInclVat?: number;
    price?: number;
    itemReferenceName?: string;
    isIgnored?: boolean;
  }
  export interface OrderItemPreview {
    type: string;
    url: string;
  }
  export interface OrderItemOptions {
    id: string;
    type: string;
    productUid: string;
    quantity: number;
  }
  export interface OrderItemAttribute {
    name: string;
    title: string;
    value: string;
    formmattedValue: string;
  }
  export interface Metadata {
    /** Max length: 100 */
    key: string;
    /** Max length: 100 */
    value: string;
  }
  export interface OrderShippingAddress {
    firstName: string;
    lastName: string;
    companyName?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    state?: string;
    country: string;
    email: string;
    phone?: string;
    isBusiness?: boolean;
    federalTaxId?: string;
    stateTaxId?: string;
    registrationStateCode?: string;
  }
  /** Allows overriding one or multiple fields within shipping address  */
  export interface OrderReturnAddress {
    companyName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postCode?: string;
    state?: string;
    country?: string;
    email?: string;
    phone?: string;
  }
  export interface OrderBillingEntity {
    id: string;
    companyName: string;
    companyNumber?: string;
    companyVatNumber?: string;
    country: string;
    recipientName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    state?: string;
    email: string;
    phone?: string;
  }
  export interface OrderShipment {
    id: string;
    shipmentMethodName: string;
    shipmentMethodUid: string;
    packageCount: number;
    minDeliveryDays: number;
    maxDeliveryDays: number;
    /** Epoch time, the docs' wrong */
    minDeliveryDate: number;
    /** Epoch time, the docs' wrong */
    maxDeliveryDate: number;
    totalWeight: number;
    fulfillmentCountry: string;
    packages: OrderShipmentPackage[];
    // -- Additional props found in actual response:
    price?: number;
    status?: string;
    address?: OrderShippingAddress[];
    fulfillmentFacilityId?: string;
    retailShippingPriceInclVat?: number;
    productionFacilityId?: string;
    shipmentOriginCountry?: string;
  }
  export interface OrderShipmentPackage {
    id: string;
    orderItemIds: string[];
    trackingCode: string;
    trackingUrl: string;
  }
  export interface OrderReceipt {
    id: string;
    orderId: string;
    transactionType: string;
    currency: string;
    items: OrderReceiptItem[];
    productsPriceInitial: number;
    productsPriceDiscount: number;
    productsPrice: number;
    productsPriceVat: number;
    productsPriceInclVat: number;
    packagingPriceInitial: number;
    packagingPriceDiscount: number;
    packagingPrice: number;
    packagingPriceVat: number;
    packagingPriceInclVat: number;
    shippingPriceInitial: number;
    shippingPriceDiscount: number;
    shippingPrice: number;
    shippingPriceVat: number;
    shippingPriceInclVat: number;
    discount: number;
    discountVat: number;
    discountInclVat: number;
    totalInitial: number;
    total: number;
    totalVat: number;
    totalInclVat: number;
    // -- Additional props found in actual response:
    type?: string;
    createdAt?: string;
    updatedAt?: string;
    receiptNumber?: string;
    billingEntity?: OrderBillingEntity;
    billingTag?: string;
  }
  export interface OrderReceiptItem {
    id: string;
    receiptId: string;
    referenceId: string;
    type: string;
    title: string;
    currency: string;
    priceBase: string;
    amount: string;
    priceInitial: number;
    discount: number;
    price: number;
    vat: number;
    priceInclVat: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface OrderSearchRequest {
    ids?: string;
    orderReferenceId?: string;
    orderReferenceIds?: string[];
    fulfillmentStatuses?: string[];
    financialStatuses?: string[];
    channels?: string[];
    countries?: string[];
    search?: string;
    startDate?: string;
    endDate?: string;
    offset?: number;
    limit?: number;
  }
  export interface OrderSearch {
    id: string;
    orderReferenceId: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    financialStatus: OrderFinancialStatus;
    channel: string;
    currency?: string;
    firstName: string;
    lastName: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    orderedAt: string;
    // -- Additional props found in actual response:
    clientId: string;
    orderType: OrderType;
    connectedOrderIds: string;
    storeId?: string;
    totalIncVat?: string;
    itemsCount: number;
  }

  export interface OrderQuoteRequest {
    orderReferenceId: string;
    customerReferenceId: string;
    currency: string;
    recipient: OrderShippingAddress;
    products: OrderItemRequest[];
    allowMultipleQuotes?: boolean;
  }

  export interface OrderQuote {
    id: string;
    itemReferenceIds: string[];
    fulfillmentCountry: string;
    shipmentMethods: OrderQuoteShipment[];
    products: OrderQuoteProduct[];
  }
  export interface OrderQuoteShipment {
    name: string;
    shipmentMethodUid: string;
    price: number;
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
    /** Epoch time, the docs' wrong */
    minDeliveryDate: number;
    /** Epoch time, the docs' wrong */
    maxDeliveryDate: number;
    type: ShipmentType;
    isPrivate: boolean;
    isBusiness: boolean;
    totalWeight: number;
    numberOfParcels: number;
  }

  export interface OrderQuoteProduct {
    itemReferenceId: string;
    productUid: string;
    quantity: number;
    currency: string;
    price: number;
    pageCount: number;
  }
}

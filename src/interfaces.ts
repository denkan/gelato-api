export namespace GelatoApiInterfaces {
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
    type: 'normal' | 'express' | 'pallet';
    name: string;
    isBusiness: boolean;
    isPrivate: boolean;
    hasTracking: boolean;
    supportedCountries: string[];
  }
}

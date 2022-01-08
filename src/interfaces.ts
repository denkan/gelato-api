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

  export interface Product {
    productUid: string;
    attributes: { [name: string]: string };
    weight: {
      value: number;
      measureUnit: string;
    };
    supportedCountries: string[];
    notSupportedCountries: string[];
    isStockable: boolean;
    isPrintable: boolean;
    validPageCounts?: number[];
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
}

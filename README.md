# Gelato API Client in JavaScript/TypeScript

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/gelato-api.svg)](https://badge.fury.io/js/gelato-api)

This library provides support for TypeScript/JavaScript [Gelato](https://www.gelato.com/)'s API. See full documentation on [Gelato API docs](https://dashboard.gelato.com/docs).

## Install

```sh
# npm
npm i -S gelato-api

# yarn
yarn add gelato-api
```

## Usage

Before you can utilize the API you need:

1. An account on [Gelato.com](https://www.gelato.com/).
2. Create an API key in [Dashboard > Developer > API Keys](https://dashboard.gelato.com/keys/manage)

```ts
import { GelatoApi } from 'gelato-api';

const gelato = new GelatoApi({ apiKey: 'YOUR-API-KEY' });
```

### Examples

#### Catalogs & Products

```ts
// Get all catalogs
const allCatalogs = await gelato.products.getCatalogs();

// Get specific catalog
const cardCatalog = await gelato.products.getCatalog('cards');

// Get/Search products in catalog
const cardProducts = await gelato.products.getProductsInCatalog('cards', { limit: 5 });

// Get specific product
const card1 = await gelato.products.getProduct('cards_pf_bb_pt_350...');

// Get cover dimensions
const dims = await gelato.products.getCoverDimensions('photobooks-softcover_pf_140x...', {
  pageCount: 30,
});

// Get prices
const cardPrices = await gelato.products.getPrices('cards_pf_bb_pt_350...', {
  country: 'SE',
  currency: 'SEK',
});

// Get stock availability
const stockInfo = await gelato.products.getStockAvailability([
  'cards_pf_bb_pt_350...',
  'photobooks-softcover_pf_140x140...',
]);
```

#### Shipment Methods

```ts
// Get available shipment methods in Sweden
const shipments = await gelato.shipment.getMethods({ country: 'SE' });
```

#### Orders

```ts
import { Gelato, GelatoApi } from 'gelato-api';

// Create order
const myOrder: Gelato.OrderCreateRequest = {
  orderType: 'draft',
  orderReferenceId: 'my-internal-order-id',
  customerReferenceId: 'my-internal-customer-id',
  currency: 'EUR',
  items: [
    {
      itemReferenceId: 'my-internal-item-id',
      productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
      quantity: 1,
      fileUrl: 'https://i1.sndcdn.com/artworks-000398776953-cwfbd0-t500x500.jpg',
    },
  ],
  shippingAddress: {
    firstName: 'Test',
    lastName: 'Testson',
    addressLine1: 'Test Street 123',
    city: 'Testville',
    postCode: '123 45',
    country: 'SE',
    email: 'test@example.com',
  },
};
const createdOrder = await gelato.orders.v3.create(myOrder);

// And more...
const createdOrder = await gelato.orders.v3.get('gelato-order-id');
const foundOrders = await gelato.orders.v3.search({ ... });

const patchedOrder = await gelato.orders.v3.patchDraft('gelato-order-id', { orderType: 'order'});
const updatedOrder = await gelato.orders.v3.update('gelato-order-id', { ... });

await gelato.orders.v3.deleteDraft('gelato-order-id');
await gelato.orders.v3.cancel('gelato-order-id');

const quotedOrder = await gelato.orders.v3.quote({ ... });
const shippingAddress = await gelato.orders.v3.getShippingAddress('gelato-order-id');
const updatedShippingAddress = await gelato.orders.v3.updateShippingAddress('gelato-order-id', { ... });
```

> **_NOTE_**
> Orders V2 is not supported for now.

## Run end-to-end tests

The E2E tests will utilize each feature supported, meaning it will list, create, update and delete actual data in the API. However, when it runs successfully it should have cleaned up any test orders. If not - it might be worth to take a look in the [Dashboard > Orders](https://dashboard.gelato.com/orders/list) to see if any manual clean up is required.

To run the e2e tests, follow these steps:

1. Rename `.env-SAMPLE` to `.env` and add your Gelato API key.
2. Run tests:
   ```sh
   npm run test:e2e
   # or
   yarn test:e2e
   ```

## Go nuts! 🥳

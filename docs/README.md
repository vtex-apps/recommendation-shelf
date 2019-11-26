# VTEX Recommendation Shelf

## Description

The VTEX Recommendation Shelf app is a store component that shows a collection of products using recommendation
strategies.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
- [Recommendation Strategies](#recommendation-strategies)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to import it in your dependencies on the `manifest.json`.

```json
  "dependencies": {
    "vtex.recommendation-shelf": "0.x"
  }
```

Then, add the `shelf.recommendation` block into your app theme.

Now, you can change the behavior of the shelf block. See an example of how to configure:

```json
"shelf.recommendation": {
  "props": {
    "strategy": "most_viewed_user",
    "secondaryStrategy": "most_viewed_store",
    "productList": {
      "maxItems": 10,
      "itemsPerPage": 4,
      "scroll": "BY_PAGE",
      "arrows": true,
      "titleText": "Most Viewed Products",
      "hideUnavailableItems": true,
      "summary": {
        "isOneClickBuy": false,
        "showBadge": true,
        "badgeText": "OFF",
        "buyButtonText": "Comprar",
        "displayBuyButton": "displayButtonHover",
        "showCollections": false,
        "showListPrice": true,
        "showLabels": false,
        "showInstallments": true,
        "showSavings": true,
        "name": {
          "showBrandName": false,
          "showSku": false,
          "showProductReference": false
        }
      }
    }
  }
}
```

## Blocks API

When implementing this app as a block, various inner blocks may be available.
The following interface lists the available blocks within `recommendation-shelf`.

```json
  "shelf.recommendation": {
    "required": ["product-summary"],
    "component": "RecommendationShelf"
  }
```

### Configuration

You can configure the `recommendation.shelf` block in your theme app using the following props:

| Prop name                  | Type                         | Description                                                                                                                                                         | Default value |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `strategy`                 | `Enum`                       | **(Required)** Recommendation strategy used to fetch product suggestions for a user. [`See Recommendation Strategies`](#recommendation-strategies)                  | -             |
| `secondaryStrategy`        | `Enum`                       | Recommendation strategy to use if the first one provides no return. [`See Recommendation Strategies`](#recommendation-strategies)                                   | -             |
| `paginationDotsVisibility` | `Enum`                       | Controls if pagination dots below the Shelf should be rendered or not. Possible values: `visible` (always show), `hidden` (never show), `desktopOnly`, `mobileOnly` | `visible`     |
| `productList`              | `ProductListSchema`          | Product list schema. [`See ProductListSchema (on vtex-apps/shelf)`](https://github.com/vtex-apps/shelf/blob/master/docs/README.md#configuration)                    | -             |
| `paidNavigationFilter`     | `PaidNavigationFilterSchema` | Paid Navigation Filter schema. `See PaidNavigationFilterSchema`                                                                                                     | -             |

Also, you can configure the product summary that is defined on shelf. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API.

`PaidNavigationFilterSchema`:

| Prop name         | Type            | Description                                                                       | Default value |
| ----------------- | --------------- | --------------------------------------------------------------------------------- | ------------- |
| `filterBingAds`   | `Boolean`       | If navigations coming from paid bing navigations should have products filtered.   | -             |
| `filterGoogleAds` | `Boolean`       | If navigations coming from paid google navigations should have products filtered. | -             |
| `categories`      | `Array(String)` | Which categories should not appear when recommendations are filtered.             | -             |

When passing categories to `paidNavigationFilter`, the `Category Slug` should be used, only lowecase letters and numbers with all other characters being replaced by `-`.

- Given the `Books & E-Books` category, the `paidNavigationFilter` object should look like:

```json
{
  "paidNavigationFilter": {
    "filterBingAds": true,
    "filterGoogleAds": true,
    "categories": ["books---e-books"]
  }
}
```

## Recommendation Strategies

Below you can find all the available recommendation strategies that can be used to fetch product sugestions.

| `strategy`              | Description                                                                                                       | Pages                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `most_viewed_store`     | Returns the most viewed products in the store                                                                     | Any                             |
| `most_viewed_user`      | Returns the most viewed products based on the interest and navigation of a certain user.                          | Any                             |
| `most_viewed_products`  | Returns the most viewed products from the same category of the current products.                                  | `store.search`, `store.product` |
| `best_sellers_store`    | Returns the best-selling products in the store                                                                    | Any                             |
| `best_sellers_user`     | Returns the best-selling products based on the interest and navigation of a certain user.                         | Any                             |
| `best_sellers_products` | Returns the best-selling products from the same category of the current products.                                 | `store.search`, `store.product` |
| `offers_store`          | Returns the main products in the store that have had a price reduction.                                           | Any                             |
| `offers_user`           | Returns the main products based on the interest and navigation of a certain user that have had a price reduction. | Any                             |
| `offers_products`       | Returns the main products from the same category of the current products that have had a price reduction.         | `store.search`, `store.product` |
| `new_releases_store`    | Returns recently released products in the store                                                                   | Any                             |
| `new_releases_user`     | Returns recently released products based on the interest and navigation of a certain user.                        | Any                             |
| `new_releases_products` | Returns recently released products from the same category of the current products.                                | `store.search`, `store.product` |

Some of the strategies are specifically based only on user interest and navigation.

| `strategy`           | Description                                                                                                    | Pages |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ----- |
| `click_history`      | Returns the respective recommended products to the last products that were clicked by the user in the store.   | Any   |
| `navigation_history` | Returns the last products that were clicked by the user in the store.                                          | Any   |
| `order_history`      | Returns the respective recommended products to the products that were purchased by the user in the store.      | Any   |
| `cart_abandonment`   | Returns the respective recommended products to the products that were abandoned in the store cart by the user. | Any   |

And some are specifically based only on the current product (recommended to be used in `store.product` pages).

| `strategy`         | Description                                                                                                      | Pages           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------- |
| `bought_together`  | Returns the complementary products in relation to the current product.                                           | `store.product` |
| `best_choice`      | Returns the products that were bought instead of the current product. (Ex.: Who clicked on this, bought this...) | `store.product` |
| `similar_products` | Returns the products considered most similar to the current product.                                             | `store.product` |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/recommendation-shelf/issues). Also feel free to [open issues](https://github.com/vtex-apps/recommendation-shelf/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.

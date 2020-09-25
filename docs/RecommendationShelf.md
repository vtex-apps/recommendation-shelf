# Recommendation Shelf

The Recommendation Shelf allows users to display a list of recommended products in your store.

## Configuration

The `recommendation-shelf` block is configured using the [Shelf](https://github.com/vtex-apps/shelf-components/blob/master/docs/Shelf.md) block.

1. Add the `recommendation-shelf` app to your theme's dependencies on the `manifest.json`:


```diff
  "dependencies": {
+   "vtex.recommendation-shelf": "1.x"
  }
```

2. Add the `recommendation-shelf` into your theme.

```json
  "store.home": {
    "blocks": [
      "flex-layout.row#recommendation-shelf",
    ]
  },
  "flex-layout.row#recommendation-shelf": {
    "children": ["recommendation-shelf"]
  }
```

If you want to further customize your list, you can pass your own `default-shelf`:

```json
  "store.home": {
    "blocks": [
      "flex-layout.row#recommendation-shelf",
    ]
  },
  "flex-layout.row#recommendation-shelf": {
    "children": ["recommendation-shelf"]
  },
  "recommendation-shelf": {
    "blocks": ["default-shelf"]
  },
  "default-shelf": {
    "blocks": ["list-context.product-list"]
  },
  "list-context.product-list": {
    "blocks": ["product-summary.shelf#demo1"],
    "children": ["slider-layout#demo-products"]
  },
  "product-summary.shelf#demo1": {
    "children": [
      "stack-layout#prodsum",
      "product-summary-name",
      "product-rating-inline",
      "product-summary-space",
      "product-summary-price",
      "product-summary-buy-button"
    ]
  },
  "slider-layout#demo-products": {
    "props": {
      "itemsPerPage": {
        "desktop": 5,
        "tablet": 3,
        "phone": 1
      },
      "infinite": true,
      "fullWidth": false
    }
  }
```

If you want to display recommendations based on the search, the block must be within the `search-result-layout`:

```json
  "store.search": {
    "blocks": [
      "search-result-layout",
    ]
  },
  "search-result-layout": {
    "blocks": [
      "search-result-layout.desktop",
      "search-result-layout.mobile",
      "search-not-found-layout"
    ]
  },
  "search-result-layout.desktop": {
    "children": [
      "flex-layout.row#searchbread",
      "flex-layout.row#searchtitle",
      "flex-layout.row#result",
      "flex-layout.row#shelf"
    ],
  },
  "flex-layout.row#shelf": {
    "children": ["recommendation-shelf"]
  },
```

### Props

The `recommendation-shelf` is responsible for performing the GraphQL query that fetches the list of recommended products based on recommendation strategies and its props can be found below:

| Prop name            | Type      | Description                                                                      | Default value      |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ------------------ |
| `strategy`           | `Enum`    | Strategy that will be used to get the recommendations of products.               | `BEST_SELLERS` |
| `secondaryStrategy`  | `Enum`    | Strategy that will be used to get the recommendations if the initial strategy does not return results. | `BEST_SELLERS` |
| `recommendation`     | `Object`  | Settings for the recommendation.                                                 | - |

`recommendation` object props:

| Prop name            | Type      | Description                                                                      | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ----- |
| `count`              | `Object`  | Sets the number of recommendations and minimum recommendations that the API should send | `{minimum: 5, recommendations: 20}` |

`count` object props:

| Prop name         | Type      | Description                                                    | Default value |
| ----------------- | --------- | -------------------------------------------------------------- | ------------- |
| `minimum`         | `number`  | Defines the minimum recommendations that the API should send   | 5             |
| `recommendations` | `number`  | Defines the number of recommendations that the API should send | 20            |


Valid values for `strategy` or `secondaryStrategy` in the `recommendation-shelf`:

| Strategy                  | Description                                                                    | Pages           |
| ------------------------- | ------------------------------------------------------------------------------ | --------------- |
| `BEST_SELLERS`            | Returns the best sellers from the store, category or product category          | Any             |
| `MOST_POPULAR`            | Returns the most popular products from the store, category or product category | Any             |
| `PRICE_REDUCTION`         | Returns the products with reduced prices from the store, category or product category | Any      |
| `NEW_RELEASES`            | Returns the latest releases from the store, category or product category       | Any             |
| `NAVIGATION_HISTORY`      | Returns products based on the user's navigation history                        | Any             |
| `SIMILAR_PRODUCTS`        | Returns products based on the search or the PDP product.                       | `store.product`, `store.search` |
| `BEST_CHOICE`             | Returns products with more visits or orders based on the search or the PDP product. | `store.product`, `store.search` |
| `BOUGHT_TOGETHER`         | Returns products bought together with the first search products or the PDP product. | `store.product`, `store.search` |

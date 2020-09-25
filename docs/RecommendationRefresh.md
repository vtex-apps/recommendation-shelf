# Recommendation Shelf with Refresh

The Recommendation Shelf with Refresh allows users to display a list of recommended products in your store based on the user history.

## Configuration

The `recommendation-refresh` block is configured using the [Refresh Shelf](https://github.com/vtex-apps/shelf-components/blob/master/docs/RefreshShelf.md) block.

1. Add the `recommendation-shelf` app to your theme's dependencies on the `manifest.json`:


```diff
  "dependencies": {
+   "vtex.recommendation-shelf": "1.x"
  }
```

2. Add the `recommendation-refresh` into your theme.

```json
  "store.home": {
    "blocks": [
      "flex-layout.row#recommendation-refresh",
    ]
  },
  "flex-layout.row#recommendation-refresh": {
    "children": ["recommendation-refresh"]
  }
```

If you want to further customize your list, you can pass your own `refresh-shelf`:

```json
  "store.home": {
    "blocks": [
      "flex-layout.row#recommendation-refresh",
    ]
  },
  "flex-layout.row#recommendation-refresh": {
    "children": ["recommendation-refresh"]
  },
  "recommendation-refresh": {
    "blocks": ["refresh-shelf"]
  },
  "refresh-shelf": {
    "blocks": ["product-summary.shelf"]
  },
  "product-summary.shelf": {
    "children": [
      "stack-layout#prodsum",
      "product-summary-name",
      "product-rating-inline",
      "product-summary-space",
      "product-summary-price",
      "add-to-cart-button"
    ]
  }
```

The `recommendation-refresh` is responsible for performing the GraphQL query that fetches the list of recommended products based on recommendation strategies and its props can be found below:

| Prop name            | Type      | Description                                                                      | Default value      |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ------------------ |
| `strategy`           | `Enum`    | Strategy that will be used to get the recommendations of products.               | `RECOMMENDATION_HISTORY` |
| `secondaryStrategy`  | `Enum`    | Strategy that will be used to get the recommendations if the initial strategy does not return results. | `RECOMMENDATION_HISTORY` |
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


Valid values for `strategy` or `secondaryStrategy` in the `recommendation-refresh`:

| Strategy                 | Description                                              | Pages   |
| ------------------------ | -------------------------------------------------------- | ------- |
| `RECOMMENDATION_HISTORY` | Returns products based on the user navigation history.   | Any     |
| `CART_HISTORY`           | Returns products based on the user cart history.         | Any     |
| `ORDER_HISTORY`          | Returns products based on the user order history.        | Any     |

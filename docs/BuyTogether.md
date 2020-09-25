# Recommendation Shelf Buy Together

The Recommendation Shelf Buy Together allows users to display a list of recommended products to buy based on the product on PDP.

## Configuration

The `recommendation-buy-together` block is configured using the [Buy Together Shelf](https://github.com/vtex-apps/shelf-components/blob/master/docs/BuyTogether.md) block.

1. Add the `recommendation-shelf` app to your theme's dependencies on the `manifest.json`:


```diff
  "dependencies": {
+   "vtex.recommendation-shelf": "1.x"
  }
```

2. Add the `recommendation-buy-together` into your theme.

```json
  "store.product": {
    "blocks": [
      "flex-layout.row#buy-together",
    ]
  },
  "flex-layout.row#buy-together": {
    "children": ["recommendation-buy-together"]
  }
```

The `recommendation-buy-together` is responsible for performing the GraphQL query that fetches the list of recommended products based on recommendation strategies and its props can be found below:

| Prop name            | Type      | Description                                                         | Default value      |
| -------------------- | --------- | ------------------------------------------------------------------- | ------------------ |
| `strategy`           | `Enum`    | Strategy that will be used to get the recommendations of products.  | `BOUGHT_TOGETHER` |
| `recommendation`     | `Object`  | Settings for the recommendation.                                    | - |

`recommendation` object props:

| Prop name            | Type      | Description                                                                      | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ----- |
| `count`              | `Object`  | Sets the number of recommendations and minimum recommendations that the API should send | `{minimum: 5, recommendations: 20}` |

`count` object props:

| Prop name         | Type      | Description                                                    | Default value |
| ----------------- | --------- | -------------------------------------------------------------- | ------------- |
| `minimum`         | `number`  | Defines the minimum recommendations that the API should send   | 5             |
| `recommendations` | `number`  | Defines the number of recommendations that the API should send | 20            |


There is only one valid value for `strategy` in the `recommendation-buy-together`:

| Strategy          | Description                                  | Pages           |
| --------------    | -------------------------------------------- | --------------- |
| `BOUGHT_TOGETHER` | Returns products based on the PDP product.   | `store.product` |

📢 Use this project, [contribute](https://github.com/vtex-apps/recommendation-shelf) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Recommendation Shelf

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The Recommendation Shelf app provides shelf components that show a collection of products using recommendation strategies.

+ ADD MEDIA

## Prerequisites

Most of recommendation strategies use user navigation as input to properly work. 

Since the Recommendation Shelf app does not fetch user data for itself, you must install the **Biggy pixel app** in your VTEX account (responsible for tracking user natigation) in order to properly use the app's components in your store.

1. Using your terminal, install the `biggy.pixel` app: 

```
vtex install biggy.pixel
```

2. Access your VTEX account admin.
3. Using the admin's sidebar, access the **Apps** section and select the **Biggy Pixel** app.
4. Click on **Settings**.
5. In the `apiKey` field, enter the key provided by the VTEX team.
6. Save your changes.

## Configuration

1. Add the `recommendation-shelf` app to your theme's dependencies on the `manifest.json`:


```diff
  "dependencies": {
+   "vtex.recommendation-shelf": "1.x"
  }
````

Now, you are able to use all blocks exported by the `recommendation-shelf` app. Check out the full list below:

| Block name     | Description                                     |
| -------------- | ----------------------------------------------- |
| `recommendation-shelf` | Displays a list of recommended products on any store page.   |
| `recommendation-buy-together` | Displays a list of recommended products to buy only on the product details page. |
| `recommendation-refresh` | Displays a list of recommended products in your store only based on the user history. | 

2. Add the `recommendation-shelf` in any store template desired, such as the `store.home`. For example:

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

:warning: *Notice you can also add the `recommendation-buy-together` and `recommendation-refresh` blocks if desired. For example:*

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

### `recommendation-shelf` props

| Prop name            | Type      | Description                                                                      | Default value      |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ------------------ |
| `strategy`           | `enum`    | Strategy that will be used to fetch and display the recommended products. Possible values can be find in the table below.   | `BEST_SELLERS` |
| `secondaryStrategy`  | `enum`    | Secondary strategy that will be used to fetch and display the recommended products if the initial strategy does not return results. Possible values can be find in the table below. | `BEST_SELLERS` |
| `recommendation`     | `object`  | Settings for the recommendation shelf.  | `undefined` |

Possible values for the `strategy` and `secondaryStrategy` props:

| Strategy         | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ | 
| `BEST_SELLERS`            | Fetches and displays the best sellers.          |
| `MOST_POPULAR`            | Fetches and displays the most popular products. | 
| `PRICE_REDUCTION`         | Fetches and displays products with reduced prices. |
| `NEW_RELEASES`            | Fetches and displays the latest releases.       | 
| `NAVIGATION_HISTORY`      | Fetches and displays products based on the user's navigation history.                        | 
| `SIMILAR_PRODUCTS`        | Fetches and displays products based on the user's search or the product being currently displayed. This prop only works in the theme template `store.product` and `store.search`. | 
| `BEST_CHOICE`             | Fetches and displays products with more visits or orders based on the user's search or the product being currently displayed. This prop only works in the theme template `store.product` and `store.search`. | 
| `BOUGHT_TOGETHER`         | Fetches and displays products bought together with the user's search or the product being currently displayed. This prop only works in the theme template `store.product` and `store.search`. | 

- `recommendation` object:

| Prop name            | Type      | Description                                                                      | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ----- |
| `count`              | `object`  | Defines the total and minimum number of recommendations that should be fetched. | `{minimum: 5, recommendations: 20}` |

- `count` object:

| Prop name         | Type      | Description                                                    | Default value |
| ----------------- | --------- | -------------------------------------------------------------- | ------------- |
| `minimum`         | `number`  | Defines the minimum recommendations that should be fetched.   | `5`             |
| `recommendations` | `number`  | Defines the total number of recommendations that should be fetched. | `20`           |

### `recommendation-buy-together` props

| Prop name            | Type      | Description                                                                      | Default value      |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ------------------ |
| `strategy`           | `enum`    | Strategy that will be used to fetch and display the recommended products. Only possible value is `BOUGHT_TOGETHER` (returns products bought together with the first search products or the PDP product.)       | `BOUGHT_TOGETHER` |
| `recommendation`     | `object`  | Settings for the recommendation shelf.  | `undefined` |

- `recommendation` object:

| Prop name            | Type      | Description                                                                      | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ----- |
| `count`              | `object`  | Defines the total and minimum number of recommendations that should be fetched. | `{minimum: 5, recommendations: 20}` |

- `count` object:

| Prop name         | Type      | Description                                                    | Default value |
| ----------------- | --------- | -------------------------------------------------------------- | ------------- |
| `minimum`         | `number`  | Defines the minimum recommendations that should be fetched.   | `5`             |
| `recommendations` | `number`  | Defines the total number of recommendations that should be fetched. | `20`            |

### `recommendation-refresh` props

| Prop name            | Type      | Description                                                                      | Default value      |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ------------------ |
| `strategy`           | `enum`    | Strategy that will be used to fetch and display the recommended products. Possible values can be find in the table below.   | `RECOMMENDATION_HISTORY` |
| `secondaryStrategy`  | `enum`    | Secondary strategy that will be used to fetch and display the recommended products if the initial strategy does not return results. Possible values can be find in the table below. | `RECOMMENDATION_HISTORY` |
| `recommendation`     | `object`  | Settings for the recommendation shelf.  | `undefined` |

Possible values for `strategy` and `secondaryStrategy` props:

| Possible strategy         | Description                                                                    | 
| ------------------------- | ------------------------------------------------------------------------------ | 
| `RECOMMENDATION_HISTORY` | Fetches and displays products based on the user's navigation history.   |
| `CART_HISTORY`           | Fetches and displays products based on the user's cart history.         | 
| `ORDER_HISTORY`          | Fetches and displays products based on the user's order history.        |

- `recommendation` object:

| Prop name            | Type      | Description                                                                      | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------- | ----- |
| `count`              | `object`  | Defines the total and minimum number of recommendations that should be fetched. | `{minimum: 5, recommendations: 20}` |

- `count` object:

| Prop name         | Type      | Description                                                    | Default value |
| ----------------- | --------- | -------------------------------------------------------------- | ------------- |
| `minimum`         | `number`  | Defines the minimum recommendations that should be fetched.   | `5`             |
| `recommendations` | `number`  | Defines the total number of recommendations that should be fetched. | `20`            |

## Customization

No CSS Handles are available yet for the app customization.

<!-- DOCS-IGNORE:start -->
## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

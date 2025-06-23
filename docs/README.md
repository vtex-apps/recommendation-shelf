> 📢 Use this project, [contribute](https://github.com/vtex-apps/recommendation-shelf) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).
 
# Product Recommendation

> ⚠️ **Warning**
>
>  Hello! Thanks for checking this app, it's currently under development and research by the VTEX Search and Personalization team, and during this phase this app should be only installed on selected accounts, if you're not in contact with the VTEX Search and Personalization team, installing this app on your workspace will not do anything. If you have any questions, please contact [our Support](https://support.vtex.com/hc/en-us/requests).

## Description

The VTEX Recommendation Shelf app is a store component that shows a collection of products using recommendation
strategies.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Usage](#usage)
    - [Configuration](#configuration)
- [Recommendation Strategies](#recommendation-strategies)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Prerequisites

Most recommendation strategies rely on user navigation data as input. Therefore, your store must be configured with our pixel for the `recommendation-shelf` to work properly. This configuration is managed by the VTEX team, so please wait for our confirmation before proceeding with the integration. 

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to import it in your store-theme dependencies on the `manifest.json`.

```json
  "dependencies": {
    "vtex.recommendation-shelf": "2.x"
  }
```

Then, add the `recommendation-shelf` block into your app theme.

Now, you can change the behavior of the shelf block. See an example of how to configure:

```json
  "recommendation-shelf#visual-similarity": {
    "blocks": ["list-context.product-list-static"],
    "props": {
      "recommendationType": "VISUAL_SIMILARITY",
      "title": "Similar itens"
    }
  },
  "list-context.product-list-static": {
    "blocks": [
      "product-summary.shelf"
    ],
    "children": [
      "slider-layout#recommendation-slider"
    ]
  },
  "slider-layout#recommendation-slider": {
    "props": {
      "itemsPerPage": {
        "desktop": 5,
        "tablet": 3,
        "phone": 2
      },
      "infinite": true
    }
  }
```

Our component relies on two other VTEX components: `slider-layout` and `product-summary.shelf`. You can customize the shelf by creating a custom product summary, for example:

```json
"product-summary.shelf#custom": {
    "children": [
      "product-summary-name",
      "product-summary-description",
      "product-summary-image",
      "product-summary-price",
      "product-summary-sku-selector",
      "product-summary-buy-button"
    ]
  }
```

For more info, see [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API.

### Configuration

You can configure the `recommendation.shelf` block in your theme app using the following props:

| Prop name                  | Type                         | Description                                                                                                                                                         | Default value |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `recommendationType`       | `Enum`                       | Recommendation strategy used to fetch product suggestions for a user. [`See Recommendation Strategies`](#recommendation-strategies)                                 | TOP_ITEMS     |
| `title`                    | `string`                     | Title to be displayed together with the shelf.                                                                                                                      | -             |
| `campaignVrn`              | `string`                     | VRN, identifier for an existing campaign. It takes preference over the **recommendationType**.                                                                      | -             |


## Recommendation Strategies

Below you can find all the available recommendation strategies that can be used to fetch product sugestions.

| `strategy`              | Description                                                                                                       | Pages                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `TOP_ITEMS`             | Returns the most bought products in the store                                                                     | Any                             |

Some of the strategies are specifically based only on user interest and navigation.

| `strategy`           | Description                                                                                                    | Pages |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ----- |
| `PERSONALIZED`       | Returns the respective recommended products to the last products that were clicked by the user in the store.   | Any   |
| `LAST_SEEN`          | Returns the respective recommended products to the last products that were viewed by the user in the store.    | Any   |

And some are specifically based only on the current product (recommended to be used in `store.product` pages).

| `strategy`          | Description                                                                                                      | Pages           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------- |
| `CROSS_SELL`        | Returns the complementary products in relation to the current product.                                           | `store.product` |
| `VISUAL_SIMILARITY` | Returns the products considered visually similar to the current product.                                         | `store.product` |
| `SIMILAR_ITEMS`     | Returns the products considered most similar to the current product.                                             | `store.product` |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/recommendation-shelf/issues). Also feel free to [open issues](https://github.com/vtex-apps/recommendation-shelf/issues/new) or contribute with pull requests.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
 
 

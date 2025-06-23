> 📢 Use this project, [contribute](https://github.com/vtex-apps/recommendation-shelf) to it, or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Recommendation

> ⚠️ **Warning**
>
> Hello! Thanks for checking out this app. It's currently under development and research by the VTEX Search and Personalization team. During this phase, the app should only be installed on selected accounts. If you're not in contact with the VTEX Search and Personalization team, installing this app on your workspace will not have any effect. If you have any questions, please contact [our Support](https://support.vtex.com/hc/en-us/requests).

## Description

The VTEX Recommendation Shelf app is a store component that displays a collection of products using recommendation strategies.

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

This app uses our store builder with the blocks architecture. To learn more about Store Builder, [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app, you need to import it in your store-theme dependencies in the `manifest.json` file.

```json
  "dependencies": {
  "vtex.recommendation-shelf": "2.x"
  }
```

Then, add the `recommendation-shelf` block into your app theme.

Now, you can change the behavior of the shelf block. See an example of how to configure it:

```json
  "recommendation-shelf#visual-similarity": {
  "blocks": ["list-context.product-list-static"],
  "props": {
    "recommendationType": "VISUAL_SIMILARITY",
    "title": "Similar items"
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

For more information, see the [Product Summary API configuration](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration).

### Configuration

You can configure the `recommendation-shelf` block in your theme app using the following props:

| Prop name            | Type     | Description                                                                                                                                      | Default value |
|----------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `recommendationType` | `Enum`   | Recommendation strategy used to fetch product suggestions for a user. [See Recommendation Strategies](#recommendation-strategies)                | TOP_ITEMS     |
| `title`              | `string` | Title to be displayed with the shelf.                                                                                                            | -             |
| `campaignVrn`        | `string` | VRN identifier for an existing campaign. Takes precedence over **recommendationType**.                                                           | -             |

## Recommendation Strategies

Below are the available recommendation strategies that can be used to fetch product suggestions:

| `strategy`   | Description                                              | Pages |
|--------------|----------------------------------------------------------|-------|
| `TOP_ITEMS`  | Returns the most bought products in the store            | Any   |

Some strategies are based on user interest and navigation:

| `strategy`     | Description                                                                                                 | Pages |
|----------------|-------------------------------------------------------------------------------------------------------------|-------|
| `PERSONALIZED` | Returns products recommended based on the last products clicked by the user in the store.                   | Any   |
| `LAST_SEEN`    | Returns products recommended based on the last products viewed by the user in the store.                    | Any   |

Others are based on the current product (recommended for use on `store.product` pages):

| `strategy`          | Description                                                                                   | Pages           |
|---------------------|-----------------------------------------------------------------------------------------------|-----------------|
| `CROSS_SELL`        | Returns complementary products related to the current product.                                | `store.product` |
| `VISUAL_SIMILARITY` | Returns products considered visually similar to the current product.                          | `store.product` |
| `SIMILAR_ITEMS`     | Returns products considered most similar to the current product.                              | `store.product` |

## Troubleshooting

Check if others have encountered similar issues [here](https://github.com/vtex-apps/recommendation-shelf/issues). Feel free to [open issues](https://github.com/vtex-apps/recommendation-shelf/issues/new) or contribute with pull requests.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END

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

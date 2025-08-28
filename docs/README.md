> 📢 Use this project, [contribute](https://github.com/vtex-apps/recommendation-shelf) to it, or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Recommendation Shelf

> ⚠️ This app is currently under development and research by the VTEX Search and Personalization team. During this phase, it should only be installed on selected accounts participating in the closed beta phase of the [Product Recommendations](https://help.vtex.com/en/tutorial/product-recommendations-beta--2QIexbD2FSXBxELUnFtg7g) feature. For other accounts, installing this app will not have any effect. If you want to adopt this feature for your business, please contact [our Support](https://support.vtex.com/hc/en-us/requests).

The Recommendation Shelf app is a store component that displays a collection of products using recommendation strategies.

![recommendation-shelf](https://cdn.jsdelivr.net/gh/vtex-apps/recommendation-shelf@master/docs/shelf.png)

> ℹ️ Learn more about [Product Recommendations](https://help.vtex.com/en/tutorial/product-recommendations-beta--2QIexbD2FSXBxELUnFtg7g).

## Before you begin

Most recommendation strategies rely on user navigation data as input. Therefore, your store must be configured with our pixel for the `recommendation-shelf` to work properly. This configuration is managed by the VTEX team, so please wait for our confirmation before proceeding with the integration.

## Installation

This app uses our store builder with the blocks architecture. To learn more about Store Builder, [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

Follow these steps to use the Recommendation Shelf app in your store:

1. Add the app as a dependency in your store theme. In your `manifest.json` file, add the following to the `dependencies` section:

   ```json
   "dependencies": {
     "vtex.recommendation-shelf": "2.x"
   }
   ```

2. Add the `recommendation-shelf` block into your app theme where you want the shelf to appear.

3. Customize the behavior of the shelf block.

   The example below shows the following configuration of the `recommendation-shelf` block and its supporting blocks:

   - It creates a `recommendation-shelf#visual-similarity` block that uses the "VISUAL_SIMILARITY" recommendation strategy and sets the shelf title to "Similar items".
   - It defines a `list-context.product-list-static` block, which includes the `product-summary.shelf` block and a child slider layout.
   - It configures the `slider-layout#recommendation-slider` block to control how many items are shown per page on desktop, tablet, and phone, and enables infinite scrolling.

   Example:

   ```json
   "recommendation-shelf#visual-similarity": {
     "blocks": ["list-context.product-list-static"],
     "props": {
       "campaignVrn": "vrn:recommendations:biggy:rec-similar-v2:00318b68-cb1b-4d5a-8b0f-cc7fbcdd014b",
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

4. Customize the product summary (optional).

   The Recommendation Shelf relies on the `slider-layout` and `product-summary.shelf` components. You can further customize the shelf by creating a custom product summary, for example:

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

### Props

Configure the `recommendation-shelf` block using the following properties:

| Prop name      | Type      | Description                                                                                                                               | Default value |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `title`        | `string`  | Shelf title displayed to users.                                                                                                           | -             |
| `campaignVrn`  | `string`  | VRN identifier for the recommendation campaign.                                                                                           | -             |
| `displayTitle` | `boolean` | Whether to show the shelf title (`true`) or hide it (`false`).                                                                            | `true`        |
| `itemsContext` | `array`   | Context source for items in the recommendation request (`PDP` or `CART`). Useful for enabling shelves on the cart page with `CROSS_SELL`. | `['PDP']`     |

## Recommendation strategies

Below are the available recommendation strategies that can be used to fetch product suggestions:

| `strategy`          | Description                                                                               | Pages           |
| ------------------- | ----------------------------------------------------------------------------------------- | --------------- |
| `TOP_ITEMS`         | Returns the most bought products in the store.                                            | Any             |
| `PERSONALIZED`      | Returns recommended products based on the last products clicked by the user in the store. | Any             |
| `LAST_SEEN`         | Returns recommended products based on the last products viewed by the user in the store.  | Any             |
| `CROSS_SELL`        | Returns complementary products related to the current product or the items in the cart.   | Any             |
| `VISUAL_SIMILARITY` | Returns products considered visually similar to the current product.                      | `store.product` |
| `SIMILAR_ITEMS`     | Returns products considered most similar to the current product.                          | `store.product` |

## Troubleshooting

Check if others have encountered similar issues [here](https://github.com/vtex-apps/recommendation-shelf/issues). Feel free to [open issues](https://github.com/vtex-apps/recommendation-shelf/issues/new) or contribute with pull requests.

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

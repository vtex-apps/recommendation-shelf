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

   - It creates a `recommendation-shelf#similar-items` block that uses a list whose VRN contains `rec-similar-v2` (similar items) and sets the shelf title to "Similar items".
   - It defines a `list-context.product-list-static` block, which includes the `product-summary.shelf` block and a child slider layout.
   - It configures the `slider-layout#recommendation-slider` block to control how many items are shown per page on desktop, tablet, and phone, and enables infinite scrolling.

   Example:

   ```json
   "recommendation-shelf#similar-items": {
     "blocks": ["list-context.product-list-static"],
     "props": {
       "campaignVrn": "vrn:recommendations:biggy:rec-similar-v2:00318b68-cb1b-4d5a-8b0f-cc7fbcdd014b",
       "title": "Similar items",
       "hiddenPaths": ["/checkout/cart", "/produto/*"]
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

Configure the `recommendation-shelf` block in your theme app using the following props:

### Props

Configure the `recommendation-shelf` block using the following properties:

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `title` | `string` | Shelf title displayed to users. | - |
| `campaignVrn` | `string` | VRN for the recommendation campaign (the recommendation **list ID** from Admin. See [Obtaining the VRN](#obtaining-the-vrn)). | - |
| `displayTitle` | `boolean` | Whether to show the shelf title (`true`) or hide it (`false`). | `true` |
| `itemsContext` | `array` | Context source for items in the recommendation request (`PDP` or `CART`). Useful for enabling shelves on the cart page with `CROSS_SELL`. | `['PDP']` |
| `hiddenPaths` | `array` | URL paths where the shelf should not be displayed. Supports exact paths (e.g. `/checkout/cart`) and prefix wildcards with `*` (e.g. `/produto/*`). Useful when the shelf is placed in a global section (such as the footer) but should be hidden on specific pages. | `[]` |
| `displayLoading` | `boolean` | Whether to display a loading placeholder while the shelf is loading (`true`) or render nothing until it is ready (`false`). | `true` |
| `loadingItemsPerPage` | `object` | The number of loading placeholders to display per device type while loading. See the [`loadingItemsPerPage` object](#loadingitemsperpage-object) section below. | `{ desktop: 5, tablet: 3, phone: 2 }` |

#### `loadingItemsPerPage` object

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `desktop` | `number` | Number of loading placeholders shown on desktop devices. | `5` |
| `tablet` | `number` | Number of loading placeholders shown on tablet devices. | `3` |
| `phone` | `number` | Number of loading placeholders shown on phone devices. | `2` |

### Obtaining the VRN

The campaignVrn prop takes the recommendation list ID from VTEX Admin. This is the identifier string shown after you create a recommendation list, also referred to as the shelf's VRN.

Once you create a list using the steps described in [Creating recommendation lists](https://help.vtex.com/en/docs/tutorials/creating-recommendation-lists), you can obtain the ID in the confirmation screen by clicking **Copy ID**.

If you need to copy the list ID of a list that already exists, follow these steps:

1. Go to **Storefront > Recommendations**.
2. Find the desired list in the shelf table.
3. Click the ⋮ menu on the shelf row.
4. Select **Copy ID**.

## Recommendation strategies

The **`campaignVrn`** string must match `vrn:recommendations:<account>:<campaign-type>:<campaign-id>`. The **`campaign-type`** segment maps to an internal **`RecommendationType`** used when calling recommendations:

| VRN `campaign-type` | Resolved `RecommendationType` | Description |
| ------------------- | ------------------------------ | ----------- |
| `rec-cross-v1`, `rec-cross-v2` | `CROSS_SELL` | Complementary products (often bought together). Use `itemsContext` `CART` on the cart page when needed. |
| `rec-similar-v1`, `rec-similar-v2` | `SIMILAR_ITEMS` | Similar-item recommendations for the current product context. |
| `rec-persona-v1`, `rec-persona-v2` | `PERSONALIZED` | Personalized recommendations from shopper behavior. |
| `rec-last-v1`, `rec-last-v2` | `LAST_SEEN` | Recently viewed products for the shopper. |
| `rec-top-items-v1`, `rec-top-items-v2` | `TOP_ITEMS` | Popular / top-performing products in the store. |
| `rec-search-v2` | `SEARCH_BASED` | Search-driven recommendations. |

`v1` and `v2` denote different generations of the same strategy kind. Use the **`campaignVrn`** copied from Admin for your list.

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

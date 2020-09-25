> :warning: :hammer:
> 
> **WIP**: Hello! Thanks for checking this app, it's currently under development and research by the VTEX Search & Personalization team,
> and during this phase this app should be only installed on selected accounts, **if you're not in contact with the** 
> **VTEX Personalization team, installing this app on your workspace will not do anything.**
> 
> _Additional information: biggy@vtex.com.br_

# VTEX Recommendation Shelf
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Description

The Recommendation Shelf app is an app that provides store components that can show a collection of products using recommendation strategies.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Blocks API](#blocks-api)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Prerequisites

Most of the recommendations use user navigation as input. Therefore, it is necessary to install `biggy.pixel` to make the `recommendation-shelf` work properly. `biggy.pixel` is app used to track user navigation.

First, install the `biggy.pixel`  app:
```
vtex install biggy.pixel
```
Then go to `/admin/apps` and select the *Biggy Pixel* app. In the `apiKey` field, insert the key provided by our team.

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to import it in your dependencies on the `manifest.json`.

```json
  "dependencies": {
    "vtex.recommendation-shelf": "1.x"
  }
```

Then, you can add the `recommendation-shelf` blocks into your app theme.

Now, you can change the behavior of the shelf blocks. See the README for each component to understand how to configure it:

- [Recommendation Shelf](RecommendationShelf.md)
- [Recommendation Shelf with Refresh](RecommendationRefresh.md)
- [Recommendation Shelf Buy Together](BuyTogether.md)

### Blocks API

When implementing this app as a block, various inner blocks may be available.
The following interface lists the available blocks within `recommendation-shelf`.

```json
  "recommendation-shelf": {
    "component": "RecommendationShelf"
  },
  "recommendation-refresh": {
    "component": "RecommendationRefresh"
  },
  "recommendation-buy-together": {
    "component": "RecommendationBuyTogether"
  }
```

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/recommendation-shelf/issues). Also feel free to [open issues](https://github.com/vtex-apps/recommendation-shelf/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.

<!-- DOCS-IGNORE:start -->
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<!-- DOCS-IGNORE:end -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.7.0] - 2025-06-24

### Changed

- Improved Component documentation.

## [2.6.0] - 2025-06-19

### Added

- Visual Similarity campaign strategy.

## [2.5.1] - 2025-06-05

### Fixed

- Always send the userId while fetching recommendations.

## [2.5.0] - 2025-06-05

### Fixed

- Shelf render for first time users.

### Added

- Looader for the Shelf.

## [2.4.1] - 2025-05-29

### Fixed

- Recommendation fetch via `recommendationType`.

## [2.4.0] - 2025-05-27

### Changed

- Using the recommendation v2 endpoints.

## [2.3.1] - 2025-05-19

### Fixed

- Cross-sell item context.

## [2.3.0] - 2025-03-27

### Added

- Recommendation view metric.

## [2.2.2] - 2025-02-04

### Fixed

- Campaign click metric.

## [2.2.1] - 2025-01-29

### Fixed

- Handling for `rec-recent-int-v1` vrn type.

## [2.2.0] - 2025-01-29

### Changed

- Move the calls to use the white-label and points
- Use VRN details to decide from where to fetch the products context.
- Add ErrorBoundary to our Component.
- Fetch userId from our own cookie vtex-recommendation-user

## [2.1.1] - 2025-01-13

### Fixed

- Always pass the `productId` upon item click while submitting the click metric.

## [2.1.0] - 2025-01-07

### Changed

- Notify product/campaigns clicks.

## [2.0.1] - 2024-12-20

### Fixed

- Import missing css definitions from `vtex.shelf-components`.

## [2.0.0] - 2024-12-20

### Removed

- `vtex.shelf-components` dependency and implement it internally.
- `default-shelf` block.
- `RecommendationRefresh` component.
- `RecommendationBuyTogether` component.

### Changed

- Using `vtex.recommendation-bff` instead of `vtex.recommendation-resolver`.

## [1.13.0] - 2024-12-19 [Deprecated]

### Changed

- Remove `vtex.shelf-components` dependency and implement it internally.

### Removed

- Remove `default-shelf` block.

## [1.12.0] - 2024-12-18 [Deprecated]

### Changed

- Using `vtex.recommendation-bff` instead of `vtex.recommendation-resolver`.

### Removed

- `RecommendationRefresh` component.
- `RecommendationBuyTogether` component.


## [1.11.0] - 2024-11-22

### Added

- `adversiment` field to our query. 

## [1.10.0] - 2024-11-05

### Changed

- Replaced `vtex.store-resources` with `vtex.recommendation-graphql` to allow direct queries and enable modifications without impacting other stores.

## [1.9.0] - 2024-10-16

## [1.8.0] - 2023-03-21

### Deprecated
- Recommendation components

## [1.7.1] - 2022-07-07

### Fixed

- Update `README.md`

## [1.7.0] - 2022-06-13

### Added
- Add `userId` to the recommendation input.

## [1.6.4] - 2022-01-28

### Fixed
- Error on `RecommendationRefresh` when `recommendations` array is empty.

## [1.6.3] - 2022-01-28

### Fixed
- Use `secondaryStrategy` when `recommendations` array is empty.


## [1.6.2] - 2022-01-10

### Fixed
- The first callout about warning

## [1.6.1] - 2021-09-03

### Fixed
- Error when recommendation response is `undefined`.

## [1.6.0] - 2021-05-05

### Added
- Missing product fields.
- Products from cart.

## [1.5.0] - 2021-04-05

### Added
- `fallback` to the recommendation.

## [1.4.1] - 2021-03-31

## [1.4.0] - 2021-03-30

### Added
- `teasers`, `discountHighlights` and properties to the `recommendation` query.

## [1.3.3] - 2021-03-24

## [1.3.2] - 2021-03-24

## [1.3.1] - 2021-03-23

### Fixed
- Project documentation.

## [1.3.0] - 2021-03-08

### Added
- `isSecondary` prop to the `default-shelf` and `refresh-shelf`

## [1.2.1] - 2021-01-25

### Fixed
- Input for secondary strategy.

## [1.2.0] - 2021-01-18

### Changed
- Skip query for buy together when `productIds` is empty.

## [1.1.0] - 2020-12-09

### Changed

- Use `RecommendationContext` to send events.

## [1.0.0] - 2020-10-29

### Added

- New recommendation components.

### Changed

- Use new recommendation API.

## [0.1.0] - 2020-07-31

### Added

- Add new fields to the `productsByIdentifier` query.

## [0.0.5] - 2020-03-25

### Added

- `isMobile` prop to `ProductList`.

## [0.0.4] - 2020-02-14

## [0.0.3] - 2019-12-16

### Added

- `paidNavigationFilter` and `seconadaryStrategy` prop.

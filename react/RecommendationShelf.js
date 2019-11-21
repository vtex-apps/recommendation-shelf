import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";
import { compose, map, path, take } from "ramda";
import { Query } from "react-apollo";
import { ProductList } from "vtex.shelf";
import { Loading, useRuntime } from "vtex.render-runtime";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { useAnonymous } from "./utils/useAnonymous";
import { useUserNavigation } from "./utils/useUserNavigation";
import useProduct from "vtex.product-context/useProduct";
import logError from "./api/log";

import productsByIdentifier from "./graphql/productsByIdentifier.gql";
import recommendation from "./graphql/recommendation.gql";

const ProductListWrapper = props => {
  const { ids } = props;
  const { account, workspace, route } = useRuntime();

  const [products, setProducts] = useState([]);

  return (
    <Query query={productsByIdentifier} variables={{ ids }}>
      {({ data, loading, error }) => {
        if (error) {
          logError(account, workspace, route.path, error);
          return null;
        }

        if (loading) {
          return <Loading />;
        }

        setProducts(path(["productsByIdentifier"], data));

        return (
          <ProductList
            {...props}
            products={products}
            loading={loading}
          ></ProductList>
        );
      }}
    </Query>
  );
};

const RecommendationShelf = ({
  strategy,
  paidNavigationFilter,
  productList,
  paginationDotsVisibility = "visible",
}) => {
  const { account, workspace, route } = useRuntime();
  const { product } = useProduct();
  const { searchQuery } = useSearchPage();
  const { anonymous: anonymousUser } = useAnonymous(account);
  const { userNavigation: userNavigationInfo } = useUserNavigation();

  const [ids, setIds] = useState([]);
  const [products, setProducts] = useState([]);

  const maxProducts = productList.maxItems || 8;
  const minProducts = productList.itemsPerPage || 4;

  useMemo(() => {
    if (product) {
      setProducts([path(["productId"], product)].filter(x => x != null));
    }

    if (searchQuery && searchQuery.products) {
      setProducts(
        compose(map(path(["productId"])), take(5))(searchQuery.products),
      );
    }
  }, [product, searchQuery]);

  return (
    <Query
      query={recommendation}
      variables={{
        strategy,
        store: account,
        products,
        anonymousUser,
        userNavigationInfo,
        settings: {
          maxProducts,
          minProducts,
          paidNavigationFilter,
        },
      }}
    >
      {({ data, loading, error }) => {
        if (error) {
          logError(account, workspace, route.path, error);
          return null;
        }

        if (loading) {
          return <Loading />;
        }

        const recommendation = map(
          path(["recommendationIds"]),
          data.recommendation,
        );

        if (recommendation.length === 0) {
          return null;
        }

        // For default view mode only the first recommendation list is required.
        setIds(recommendation[0]);

        return (
          <ProductListWrapper
            loading={loading}
            ids={ids}
            paginationDotsVisibility={paginationDotsVisibility}
            {...productList}
          ></ProductListWrapper>
        );
      }}
    </Query>
  );
};

RecommendationShelf.propTypes = {
  /** Recommendation strategy used to fetch product suggestions for a user. */
  strategy: PropTypes.oneOf([
    "most_viewed_store",
    "most_viewed_user",
    "most_viewed_products",
    "best_sellers_store",
    "best_sellers_user",
    "best_sellers_products",
    "offers_store",
    "offers_user",
    "offers_products",
    "new_releases_store",
    "new_releases_user",
    "new_releases_products",
    "click_history",
    "navigation_history",
    "order_history",
    "cart_abandonment",
    "bought_together",
    "best_choice",
    "similar_products",
  ]).isRequired,
  /** Should display navigation dots below the Shelf */
  paginationDotsVisibility: PropTypes.oneOf([
    "visible",
    "hidden",
    "mobileOnly",
    "desktopOnly",
  ]),
  /** ProductList schema configuration */
  productList: PropTypes.object,
  /** Paid Navigation filter schema configuration */
  paidNavigationFilter: PropTypes.shape({
    filterBingAds: PropTypes.bool,
    filterGoogleAds: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default RecommendationShelf;

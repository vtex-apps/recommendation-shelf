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

const RecommendationShelf = ({ strategy, productList }) => {
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
        compose(
          map(path(["productId"])),
          take(5),
        )(searchQuery.products),
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
            {...productList}
          ></ProductListWrapper>
        );
      }}
    </Query>
  );
};

export default RecommendationShelf;

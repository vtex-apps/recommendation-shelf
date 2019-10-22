import React, { useState, useMemo, useEffect } from "react";
import { compose, map, path, take } from "ramda";
import { Query } from "react-apollo";
import { ProductList } from "vtex.shelf";
import { Loading } from "vtex.render-runtime";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import useProduct from "vtex.product-context/useProduct";
import withAccount from "./withAccount";

import productsByIdentifier from "./graphql/productsByIdentifier.gql";
import recommendation from "./graphql/recommendation.gql";

const ProductListWrapper = props => {
  const { ids } = props;
  const [products, setProducts] = useState([]);

  return (
    <Query query={productsByIdentifier} variables={{ ids }}>
      {({ data, loading, error }) => {
        if (error) return null;

        if (loading) {
          return <Loading />;
        }

        if (data && data.productsByIdentifier) {
          setProducts(data.productsByIdentifier);
        }

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

const RecommendationShelf = ({ strategy, productList, account: store }) => {
  const { product } = useProduct();
  const { searchQuery } = useSearchPage();
  const [ids, setIds] = useState([]);
  const [products, setProducts] = useState([]);

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
        store,
        products,
      }}
    >
      {({ data, loading, error }) => {
        if (error) return null;

        if (loading) {
          return <Loading />;
        }

        if (data && data.recommendation) {
          setIds(data.recommendation.recommendationIds);
        }

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

export default withAccount(RecommendationShelf);

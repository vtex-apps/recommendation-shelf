import React, { useState } from "react";
import { Query } from "react-apollo";
import { ProductList } from "vtex.shelf";
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
  const [ids, setIds] = useState([]);

  return (
    <Query
      query={recommendation}
      variables={{
        strategy,
        store,
      }}
    >
      {({ data, loading, error }) => {
        if (error) return null;

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

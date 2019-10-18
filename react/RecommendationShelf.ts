const RecommendationShelf = ({  }: RecommendationShelfProps) => {
  // const productListProps = {
  //   products: [],
  //   loading,
  //   ...productList,
  // };

  return null;
};

export interface RecommendationShelfProps {
  strategy: string;
  productList: ProductListSchema;
}

interface ProductListSchema {
  /** Maximum number of items in the shelf. */
  maxItems: number;
  /** Maximum number of items in a page. */
  itemsPerPage: number;
  /** Scroll options. */
  scroll: string;
  /** If the arrows are showable or not. */
  arrows: boolean;
  /** Show value of the title. */
  showTitle: boolean;
  /** Text value of the title. */
  titleText: string;
  /** Product Summary schema props */
  summary: any;
}

export default RecommendationShelf;

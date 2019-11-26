import { IOContext } from "@vtex/api";
import BiggyFrontClient from "../clients";

export const queries = {
  recommendation: (_: any, input: RecommendationInput, ctx: IContext): {} => {
    const { biggyFront } = ctx.clients;

    return biggyFront.recommendation(input);
  },
};

export interface IContext {
  vtex: IOContext;
  clients: {
    biggyFront: BiggyFrontClient;
  };
}

export interface RecommendationInput {
  store: string;
  strategy: string;
  secondaryStrategy: string;
  user?: string;
  anonymousUser?: string;
  products?: string[];
  categories?: string[];
  userNavigationInfo?: { google: boolean; bing: boolean };
  settings?: {
    minProducts?: number;
    maxProducts?: number;
    paidNavigationFilter?: PaidNavigationFilter;
  };
}

// tslint:disable-next-line:interface-over-type-literal
export type KeyValueDict = { [key: string]: string };
export type KeyValueArray = Array<{ key: string; value: string }>;
export type KeyValuePair = KeyValueArray | KeyValueDict;

export interface ApiBasedRecommendation {
  baseIds: string[];
  baseItems: ProductRecommendation[];
  recommendationIds: string[];
  recommendationItems: ProductRecommendation[];
}

export interface ProductRecommendation {
  productId: string;
  score: number;
  offers: ProductRecommendationOffer[];
  specs: ProductSpec[];
}

export interface ProductRecommendationOffer {
  offerId: string;
  originalProductId: string;
  sku: string;
  distributionCenter: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  secondaryImageUrl: string;
  price: string;
  oldPrice: string;
  currencySymbol: string;
  hasDiscount: boolean;
  discountPercentage: number;
  brand: string;
  score: number;
  specs: ProductSpec[];
  categories: Category[];

  extraInfo: KeyValuePair;
  installment: KeyValuePair;
  imageUrlMap: KeyValuePair;
}

export interface ProductSpec {
  id: string;
  label: string;
  type: string;
  offerId: string;
  subSpecs: ProductSpec[];

  images: KeyValuePair;
}

export interface Category {
  name: string;
  parent: string;
  originalId: string;
  ancestors: string[];
}

export interface PaidNavigationFilter {
  filterBingAds: boolean;
  filterGoogleAds: boolean;
  categories: string[];
}

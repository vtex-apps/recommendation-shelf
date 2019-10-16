import { IOContext } from "@vtex/api";
import BiggyFrontClient from "../clients";

export const queries = {
  recommendation: (_: any, input: IRecommendationInput, ctx: IContext): {} => {
    const { biggyFront } = ctx.clients;

    return biggyFront.recommendation(input);
  },
};

export interface IRecommendationInput {
  store: string;
  strategy: string;
  page: string;
  user?: string;
  products?: string[];
  categories?: string[];
}

export interface IContext {
  vtex: IOContext;
  clients: {
    biggyFront: BiggyFrontClient;
  };
}

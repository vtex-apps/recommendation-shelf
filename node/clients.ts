import {
  ExternalClient,
  InstanceOptions,
  IOClients,
  IOContext,
} from "@vtex/api";
import {
  ApiBasedRecommendation,
  KeyValueArray,
  ProductRecommendation,
  ProductSpec,
  RecommendationInput,
} from "./resolvers/queries";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggyFront() {
    return this.getOrSet("biggyFront", BiggyFrontClient);
  }
}

export default class BiggyFrontClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://api.biggylabs.com.br/rec-api/v1/", context, options);
  }

  public async recommendation(
    input: RecommendationInput,
  ): Promise<ApiBasedRecommendation[]> {
    const {
      store,
      strategy,
      user,
      anonymousUser,
      products,
      categories,
      userNavigationInfo,
    } = input;

    try {
      const result = await this.http.post<ApiBasedRecommendation[]>(
        `${store}/io/ondemand/${strategy}`,
        {
          user,
          anonymousUser,
          products,
          categories,
          userNavigationInfo,
        },
        {
          metric: "recommendation",
        },
      );

      for (const recommendation of result) {
        if (recommendation.baseItems) {
          recommendation.baseItems.map(item => this.restructure(item));
        }

        if (recommendation.recommendationItems) {
          recommendation.recommendationItems.map(item =>
            this.restructure(item),
          );
        }
      }

      return result;
    } catch (err) {
      // TODO: log error to monitoring solution
      return [];
    }
  }

  private restructure(item: ProductRecommendation): ProductRecommendation {
    const restructureField = (field: string, object: any) => {
      if (object[field]) {
        const tmp: KeyValueArray = [];

        for (const key of Object.keys(object[field])) {
          tmp.push({
            key,
            value: object[field][key],
          });
        }

        object[field] = tmp;
      }
    };

    if (item.offers) {
      for (const offer of item.offers) {
        restructureField("extraInfo", offer);
        restructureField("installment", offer);
        restructureField("imageUrlMap", offer);
      }
    }

    const restructureSpecs = (specs: ProductSpec[]) => {
      if (specs) {
        for (const spec of specs) {
          restructureField("images", spec);

          if (spec.subSpecs) {
            restructureSpecs(spec.subSpecs);
          }
        }
      }
    };

    return item;
  }
}

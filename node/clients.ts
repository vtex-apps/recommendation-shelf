import {
  ExternalClient,
  InstanceOptions,
  IOClients,
  IOContext,
} from "@vtex/api";
import { IRecommendationInput } from "./resolvers/queries";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggyFront() {
    return this.getOrSet("biggyFront", BiggyFrontClient);
  }
}

export default class BiggyFrontClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://api.biggylabs.com.br/rec-api/v2/", context, options);
  }

  public recommendation(input: IRecommendationInput): Promise<{}> {
    const { store, strategy, page, user, products, categories } = input;

    return this.http.post<{}>(
      `${store}/ondemand/${strategy}`,
      {
        channel: "io",
        page,
        user,
        products,
        categories,
      },
      {
        metric: "recommendation",
      },
    );
  }
}

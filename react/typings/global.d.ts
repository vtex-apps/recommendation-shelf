import type { FunctionComponent } from 'react'

declare global {
  /* eslint-disable @typescript-eslint/ban-types */
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  export type RecommendationType =
    | 'CROSS_SELL'
    | 'SIMILAR_ITEMS'
    | 'PERSONALIZED'
    | 'TOP_ITEMS'
    | 'LAST_SEEN'
    | 'VISUAL_SIMILARITY'
}

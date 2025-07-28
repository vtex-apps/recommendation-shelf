import type { FunctionComponent } from 'react'

declare global {
  /* eslint-disable @typescript-eslint/ban-types */
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface Window {
    __RUNTIME__?: {
      account?: string
      // add other properties if needed
    }
  }

  export type RecommendationType =
    | 'CROSS_SELL'
    | 'SIMILAR_ITEMS'
    | 'PERSONALIZED'
    | 'TOP_ITEMS'
    | 'LAST_SEEN'
    | 'VISUAL_SIMILARITY'
}

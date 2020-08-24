import { FunctionComponent } from 'react'

declare global {
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface Count {
    minimum?: number
    recommendations?: number
  }

  interface Sort {
    field?: string
    desc?: boolean
  }

  interface Recommendation {
    count?: Count
    sort?: Sort
  }
}

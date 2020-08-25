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

  enum FilterField {
    TRADEPOLICY = 'trade policy',
    SELLER = 'seller',
    BRAND = 'brand',
    CATEGORY = 'category',
  }

  enum FilterType {
    KEEP = 'keep',
    REMOVE = 'remove',
  }

  interface Filter {
    type: FilterType
    field: FilterField
    value: string
  }

  interface RecommendationOptions {
    count?: Count
    sort?: Sort[]
    filter?: Filter[]
  }

  enum RequestInputType {
    USER = 'USER',
    CATEGORY = 'CATEGORY',
    PRODUCT = 'PRODUCT',
    TAG_GROUP = 'TAG_GROUP',
    CAMPAIGN = 'CAMPAIGN',
    GROUP = 'GROUP',
    ANONYMOUS_USER = 'ANONYMOUS_USER',
    BRAND = 'BRAND',
    STORE = 'STORE',
  }

  interface InputRecommendation {
    type: RequestInputType
    values: string[]
  }
}

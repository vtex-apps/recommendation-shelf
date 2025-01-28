declare module '*/QueryRecommendationShelf.gql' {
  import type { DocumentNode } from 'graphql'
  import type { Query } from 'vtex.recommendation-bff'

  type Response = {
    recommendationsV1: Query['syneriseRecommendationV1'] & {
      correlationId: string
    }
  }

  type Args = {
    campaignVrn: string
    userId: string
    products?: string[]
  }

  type Product = Response['syneriseRecommendationV1']['products'][0]

  export { Response, Args, Product }

  const content: DocumentNode
  export default content
}

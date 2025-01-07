declare module '*/QueryRecommendationShelf.gql' {
  import type { DocumentNode } from 'graphql'
  import type {
    Query,
    QuerySyneriseRecommendationV1Args as Args,
  } from 'vtex.recommendation-bff'

  type Response = {
    syneriseRecommendationV1: Query['syneriseRecommendationV1'] & {
      correlationId: string
    }
  }

  type Product = Response['syneriseRecommendationV1']['products'][0]

  export { Response, Args, Product }

  const content: DocumentNode
  export default content
}

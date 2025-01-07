declare module '*/QueryRecommendationShelf.gql' {
  import type { DocumentNode } from 'graphql'
  import type {
    Query,
    QuerySyneriseRecommendationV1Args as Args,
  } from 'vtex.recommendation-shelf'

  type Response = {
    syneriseRecommendationV1: Query['syneriseRecommendationV1'] & {
      correlationId: string
    }
  }

  export { Response, Args }

  const content: DocumentNode
  export default content
}

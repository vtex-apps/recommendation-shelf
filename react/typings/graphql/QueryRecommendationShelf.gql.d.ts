declare module '*/QueryRecommendationShelf.gql' {
  import type { DocumentNode } from 'graphql'
  import type { Query, Product } from 'vtex.recommendation-bff'

  type Response = {
    recommendationsV2: Query['recommendationsV2']
  }

  type Args = {
    campaignVrn: string
    userId: string
    products?: string[]
  }

  export { Response, Args, Product }

  const content: DocumentNode
  export default content
}

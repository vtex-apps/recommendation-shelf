declare module 'recommend-bff' {
  export type Product = {
    productId: string
    items: Array<{
      itemId: string
    }>
  }

  export type RecommendationsV2RequestQuery = {
    an: string
    userId: string
    campaignVrn: string
    products?: string
  }

  export type RecommendationsV2Response = {
    products: Product[]
    correlationId: string
    campaign: {
      id: string
      title?: string
      type: RecommendationType
    }
  }

  export type StartSessionRequestBody = {
    userId?: string
  }

  export type StartSessionResponse = {
    recommendationsUserId: string
  }
}

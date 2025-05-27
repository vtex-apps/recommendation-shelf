import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import type { Args, Response } from '../graphql/QueryRecommendationShelf.gql'
import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'

function useRecommendation({
  recommendationType,
  campaignVrn,
  products,
  userId,
}: {
  recommendationType: RecommendationType
  campaignVrn?: string
  products: string[]
  userId: string
}) {
  const variables: Args = campaignVrn
    ? {
        userId,
        campaignVrn,
        products,
      }
    : {
        userId,
        campaignType: recommendationType,
        products,
      }

  const { error, data, loading } = useQuery<Response, Args>(
    recommendationQuery,
    {
      variables,
      skip: !canUseDOM || !campaignVrn || !userId,
      notifyOnNetworkStatusChange: true,
    }
  )

  return {
    error,
    data,
    loading,
  }
}

export default useRecommendation

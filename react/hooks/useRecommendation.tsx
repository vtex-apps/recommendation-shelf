import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import type { Args, Response } from '../graphql/QueryRecommendationShelf.gql'
import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'

function useRecommendation({
  campaignVrn,
  products,
  userId,
}: {
  campaignVrn?: string
  products: string[]
  userId: string
}) {
  const variables = {
    userId,
    campaignVrn: campaignVrn ?? '',
    products,
  }

  const { error, data } = useQuery<Response, Args>(recommendationQuery, {
    variables,
    skip: !canUseDOM || !campaignVrn || !userId,
    notifyOnNetworkStatusChange: true,
  })

  return {
    error,
    data,
  }
}

export default useRecommendation

/* eslint-disable padding-line-between-statements */
import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import type { Args, Response } from '../graphql/QueryRecommendationShelf.gql'
import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'

type RecommendationInput = {
  campaignType: RecommendationType
  campaignVrn?: string
  products: string[]
  userId?: string | null
}

function getRecommendationArguments(input: RecommendationInput): Args | null {
  const { campaignType, userId, products } = input

  let args: Args = input.campaignVrn
    ? ({
        campaignVrn: input.campaignVrn,
      } as Args)
    : {
        campaignType: input.campaignType,
      }

  switch (campaignType) {
    case 'CROSS_SELL':
    case 'SIMILAR_ITEMS':
      if (products.length === 0) {
        return null
      }
      args = {
        ...args,
        products: [products[0]],
      }

      break
    case 'LAST_SEEN':
    case 'PERSONALIZED':
      if (!userId) {
        return null
      }
      args = {
        ...args,
        userId,
      }
      break
    default:
      break
  }

  return args
}

function useRecommendation(args: RecommendationInput) {
  const variables = getRecommendationArguments(args)

  const { error, data, loading } = useQuery<Response, Args>(
    recommendationQuery,
    {
      variables: variables as Args,
      skip: !canUseDOM || !variables,
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

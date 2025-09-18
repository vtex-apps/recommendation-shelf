import { useEffect, useState } from 'react'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import type {
  RecommendationsV2RequestQuery as Args,
  RecommendationsV2Response as Response,
} from 'recommend-bff'

import { generateRecOriginHeader } from '../utils/requests'
import { getTypeFromVrn } from '../utils/vrn'

type RecommendationInput = {
  campaignVrn: string
  products: string[]
  userId?: string | null
}

function getRecommendationArguments(
  input: RecommendationInput,
  account: string
): Args | null {
  const { userId, products, campaignVrn } = input

  const recommendationType = getTypeFromVrn(campaignVrn)

  if (!userId) {
    return null
  }

  let args: Args = {
    an: account,
    campaignVrn,
    userId,
  }

  /* eslint-disable padding-line-between-statements */
  switch (recommendationType) {
    case 'VISUAL_SIMILARITY':
    case 'SIMILAR_ITEMS':
      if (products.length === 0) {
        return null
      }
      args = {
        ...args,
        an: account,
        products: products[0],
      }

      break
    case 'CROSS_SELL':
      if (products.length === 0) {
        return null
      }
      args = {
        ...args,
        an: account,
        products: products.join(';'),
      }
      break
    default:
      break
  }

  return args
}

function useRecommendations(args: RecommendationInput) {
  const runtime = useRuntime()
  const { account } = runtime

  const variables = getRecommendationArguments(args, account)
  const shouldSkip = !canUseDOM || !variables
  const userId = variables?.userId
  const products = variables?.products
  const campaignVrn = variables?.campaignVrn

  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (shouldSkip) return

    setLoading(true)
    setError(null)

    const params: Record<string, string> = {
      an: account,
    }
    if (userId) params.userId = userId
    if (products) params.products = products
    if (campaignVrn) params.campaignVrn = campaignVrn

    const queryParams = new URLSearchParams(params).toString()

    fetch(`/api/recommend-bff/v2/recommendations?${queryParams}`, {
      method: 'GET',
      headers: {
        ...generateRecOriginHeader(account),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      })
      .catch((err) => {
        setError(err)
        setData(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account, shouldSkip, userId, products, campaignVrn])

  return {
    error,
    data,
    loading,
  }
}

export default useRecommendations

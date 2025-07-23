import { useEffect, useState } from 'react'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import type {
  RecommendationsV2RequestQuery as Args,
  RecommendationsV2Response as Response,
} from 'recommend-bff'

type RecommendationInput = {
  recommendationType: RecommendationType
  campaignVrn?: string
  products: string[]
  userId?: string | null
}

function getRecommendationArguments(
  input: RecommendationInput,
  account: string
): Args | null {
  const { recommendationType, userId, products } = input

  if (!userId) {
    return null
  }

  let args: Args = input.campaignVrn
    ? ({
        an: account,
        campaignVrn: input.campaignVrn,
        userId,
      } as Args)
    : {
        an: account,
        recommendationType,
        userId,
      }

  /* eslint-disable padding-line-between-statements */
  switch (input.recommendationType) {
    case 'VISUAL_SIMILARITY':
    case 'CROSS_SELL':
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
    default:
      break
  }

  return args
}

function useRecommendation(args: RecommendationInput) {
  const runtime = useRuntime()
  const { account } = runtime

  const variables = getRecommendationArguments(args, account)
  const shouldSkip = !canUseDOM || !variables
  const userId = variables?.userId
  const products = variables?.products
  const campaignVrn = variables?.campaignVrn
  const recommendationType = variables?.recommendationType

  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!shouldSkip) return

    setLoading(true)
    setError(null)

    const params: Record<string, string> = {
      an: account,
    }
    if (userId) params.userId = userId
    if (recommendationType) params.recommendationType = recommendationType
    if (products) params.products = products
    if (campaignVrn) params.campaignVrn = campaignVrn

    const queryParams = new URLSearchParams(params).toString()

    fetch(`/api/recommend-bff/recommendations/v2?${queryParams}`, {
      method: 'GET',
      headers: {
        'x-vtex-rec-origin': `${account}/storefront/vtex.recommendation-shelf@2.x`,
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
  }, [account, shouldSkip, userId, products, campaignVrn, recommendationType])

  return {
    error,
    data,
    loading,
  }
}

export default useRecommendation

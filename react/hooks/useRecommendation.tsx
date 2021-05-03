import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import recommendationQuery from 'vtex.store-resources/QueryRecommendationShelf'

import { buildInputByStrategy } from '../utils/buildInput'
import { useAnonymous } from '../utils/useAnonymous'
import { useSession } from '../utils/useSession'

/* eslint-disable max-params */
function useRecommendation<D = Data>(
  strategy: string,
  recommendation: RecommendationOptions,
  productIds?: string[],
  categories?: string[],
  secondaryStrategy?: string
) {
  const { account } = useRuntime()
  const { sessionId } = useSession(account)
  const { anonymous } = useAnonymous(account)
  const [useSecondary, setUseSecondary] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  const skipQuery = useMemo(
    () => !sessionId || (strategy === 'BOUGHT_TOGETHER' && !productIds?.length),
    [productIds, sessionId, strategy]
  )

  const input = buildInputByStrategy(
    strategy,
    productIds,
    categories,
    anonymous,
    useFallback
  )

  const secondaryInput = useMemo(() => {
    if (!secondaryStrategy) {
      return input
    }

    return buildInputByStrategy(
      secondaryStrategy,
      productIds,
      categories,
      anonymous,
      useFallback
    )
  }, [anonymous, categories, input, productIds, secondaryStrategy, useFallback])

  const variables = {
    input: {
      sessionId: sessionId ?? '',
      strategy,
      input,
      recommendation,
    },
  }

  const secondaryVariables = {
    input: {
      sessionId: sessionId ?? '',
      strategy: secondaryStrategy ?? '',
      input: secondaryInput,
      recommendation,
    },
  }

  const { error, data } = useQuery<D, Variables>(recommendationQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip: skipQuery,
    onError: () => {
      setUseSecondary(!!secondaryStrategy)
    },
  })

  const { error: secondaryError, data: secondaryData } = useQuery<D, Variables>(
    recommendationQuery,
    {
      variables: secondaryVariables,
      notifyOnNetworkStatusChange: true,
      skip: !sessionId || !useSecondary,
    }
  )

  useEffect(() => {
    // Use fallback when secondaryStrategy is not set
    if (error && !secondaryStrategy) {
      setUseFallback(true)
    }

    // Use fallback when secondaryStrategy is set
    if (error && secondaryError && !useFallback) {
      setUseSecondary(false)
      setUseFallback(true)
    }
  }, [
    error,
    secondaryError,
    secondaryStrategy,
    useFallback,
    useSecondary,
    strategy,
  ])

  return {
    error: useSecondary ? secondaryError : error,
    data: useSecondary ? secondaryData : data,
    isSecondary: useSecondary,
  }
}

interface Data {
  recommendation: RecommendationAPI
}

interface Variables {
  input: {
    sessionId: string
    strategy: string
    input: InputRecommendation
    recommendation: RecommendationOptions
  }
}

export default useRecommendation

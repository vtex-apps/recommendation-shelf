import { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import recommendationQuery from '../graphql/recommendation.gql'
import { buildInputByStrategy } from '../utils/buildInput'
import { useAnonymous } from '../utils/useAnonymous'
import { useSession } from '../utils/useSession'

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

  const input = buildInputByStrategy(
    strategy,
    productIds,
    categories,
    anonymous
  )

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
      input,
      recommendation,
    },
  }

  const { error, data } = useQuery<D, Variables & {}>(recommendationQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip: !sessionId,
  })

  const { error: secondaryError, data: secondaryData } = useQuery<
    D,
    Variables & {}
  >(recommendationQuery, {
    variables: secondaryVariables,
    notifyOnNetworkStatusChange: true,
    skip: !sessionId || !useSecondary,
  })

  useEffect(() => {
    if (error && secondaryStrategy) {
      setUseSecondary(true)
    } else {
      setUseSecondary(false)
    }
  }, [error, secondaryStrategy])

  return {
    error: useSecondary ? secondaryError : error,
    data: useSecondary ? secondaryData : data,
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

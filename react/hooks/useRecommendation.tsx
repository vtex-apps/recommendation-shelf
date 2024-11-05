import { useState } from 'react'
import { useQuery } from 'react-apollo'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'

import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'
import { buildInputByStrategy } from '../utils/buildInput'
import { getCookie } from '../utils/dom-utils'
import setCookie from '../utils/setCookie'
import { useAnonymous } from '../utils/useAnonymous'
import useProfile from './useProfile'
import useVariant from './useVariant'

/* eslint-disable max-params */
function useRecommendation<D = Data>(
  strategy: string,
  recommendation: RecommendationOptions,
  productIds?: string[],
  categories?: string[],
  secondaryStrategy?: string,
  campaignId?: string
) {
  const { account } = useRuntime()
  const { anonymous } = useAnonymous(account)
  const { profile } = useProfile()
  const [useSecondary, setUseSecondary] = useState(false)
  const [useFallback] = useState(false)
  const { variant } = useVariant()

  const uuid = canUseDOM ? getCookie('_snrs_uuid')! : ''

  const input = buildInputByStrategy(
    strategy,
    productIds,
    categories,
    anonymous,
    useFallback,
    profile?.id?.value
  )

  const variables = {
    input: {
      uuid,
      campaignId: campaignId!,
      jwt: canUseDOM ? getCookie('_snrs_jwt_shelf')! : undefined,
      input,
      recommendation,
      variant,
    },
  }

  const { error, data } = useQuery<D, Variables>(recommendationQuery, {
    variables,
    skip: !canUseDOM || !campaignId || !uuid,
    notifyOnNetworkStatusChange: true,
    onCompleted: (result: unknown) => {
      if (!(result as any)?.recommendation?.products?.length) {
        setUseSecondary(!!secondaryStrategy)
      } else {
        setCookie('_snrs_jwt_shelf', (result as any).recommendation.jwt)
      }
    },
    onError: () => {
      setUseSecondary(!!secondaryStrategy)
    },
  })

  return {
    error,
    data,
    isSecondary: useSecondary,
  }
}

interface Data {
  recommendation: RecommendationAPI
}

interface Variables {
  input: {
    uuid: string
    campaignId: string
    jwt?: string
    input: InputRecommendation
    recommendation: RecommendationOptions
  }
}

export default useRecommendation

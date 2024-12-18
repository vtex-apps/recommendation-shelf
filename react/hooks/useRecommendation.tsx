import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'
import { getCookie } from '../utils/dom-utils'

function useRecommendation<D = Data>(campaignId: string, productId?: string) {
  const uuid = canUseDOM ? getCookie('_snrs_uuid') : ''

  const variables = {
    synUserId: uuid ?? '',
    campaignId,
    productId,
  }

  const { error, data } = useQuery<D, Variables>(recommendationQuery, {
    variables,
    skip: !canUseDOM || !campaignId || !uuid,
    notifyOnNetworkStatusChange: true,
  })

  return {
    error,
    data,
  }
}

type Data = {
  syneriseRecommendationV1: RecommendationResponse
}

type Variables = {
  synUserId: string
  campaignId: string
  productId?: string
}

export default useRecommendation

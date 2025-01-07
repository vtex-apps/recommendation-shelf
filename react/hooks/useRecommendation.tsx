import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import type { Args, Response } from '../graphql/QueryRecommendationShelf.gql'
import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'
import { getCookie } from '../utils/dom-utils'

function useRecommendation(campaignId: string, productId?: string) {
  const uuid = canUseDOM ? getCookie('_snrs_uuid') : ''

  const variables = {
    synUserId: uuid ?? '',
    campaignId,
    productId,
  }

  const { error, data } = useQuery<Response, Args>(recommendationQuery, {
    variables,
    skip: !canUseDOM || !campaignId || !uuid,
    notifyOnNetworkStatusChange: true,
  })

  return {
    error,
    data,
  }
}

export default useRecommendation

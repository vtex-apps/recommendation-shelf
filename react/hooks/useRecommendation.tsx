import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import type { Args, Response } from '../graphql/QueryRecommendationShelf.gql'
import recommendationQuery from '../graphql/QueryRecommendationShelf.gql'
import { getCookie } from '../utils/dom'

function useRecommendation(campaignVrn: string, products?: string[]) {
  const uuid = canUseDOM ? getCookie('_snrs_uuid') : ''

  const variables = {
    userId: uuid ?? '',
    campaignVrn,
    products,
  }

  const { error, data } = useQuery<Response, Args>(recommendationQuery, {
    variables,
    skip: !canUseDOM || !campaignVrn || !uuid,
    notifyOnNetworkStatusChange: true,
  })

  return {
    error,
    data,
  }
}

export default useRecommendation

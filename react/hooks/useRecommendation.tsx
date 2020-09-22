import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import recommendationQuery from '../graphql/recommendation.gql'
import { useSession } from '../utils/useSession'

enum FilterField {
  TRADEPOLICY = 'trade_policy',
  SELLER = 'seller',
  BRAND = 'brand',
  CATEGORY = 'category',
}

enum FilterType {
  ONLY = 'only',
  REMOVE = 'remove',
}

function useRecommendation<D = Data>(
  strategy: string,
  input: InputRecommendation,
  recommendation: RecommendationOptions
) {
  const { account } = useRuntime()
  const { sessionId } = useSession(account)

  // get trade policy
  const filter = [
    {
      field: FilterField.TRADEPOLICY,
      condition: FilterType.ONLY,
      value: '1',
    },
  ]

  const variables = {
    input: {
      sessionId: sessionId ?? '',
      strategy,
      input,
      recommendation,
      filter,
    },
  }
  const { error, data } = useQuery<D, Variables & {}>(recommendationQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
    skip: !sessionId,
  })

  return { error, data }
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
    sort?: Sort[]
    filter?: Filter[]
  }
}

export default useRecommendation

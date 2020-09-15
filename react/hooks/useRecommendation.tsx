import { useQuery } from 'react-apollo'

import recommendationQuery from '../graphql/recommendation.gql'

enum FilterField {
  TRADEPOLICY = 'trade policy',
  SELLER = 'seller',
  BRAND = 'brand',
  CATEGORY = 'category',
}

enum FilterType {
  KEEP = 'keep',
  REMOVE = 'remove',
}

function useRecommendation<D = Data>(
  strategy: string,
  input: InputRecommendation,
  recommendation: RecommendationOptions
) {
  // get trade policy
  const filter = [
    {
      name: FilterField.TRADEPOLICY,
      mode: FilterType.KEEP,
      value: '1',
    },
  ]

  // get sessionId
  const variables = {
    input: {
      sessionId: 'session_123',
      strategy,
      input,
      recommendation,
      filter,
    },
  }
  const { error, data } = useQuery<D, Variables & {}>(recommendationQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
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

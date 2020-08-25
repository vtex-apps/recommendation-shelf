import { useQuery } from 'react-apollo'

import recommendationQuery from '../graphql/recommendation.gql'

// test Data
function useRecommendation<D = Data>(
  strategy: string,
  input: InputRecommendation,
  recommendation: RecommendationOptions
) {
  // get sessionId
  const variables = {
    input: {
      sessionId: '1',
      request: {
        strategy,
        input,
        recommendation,
      },
    },
  }
  const { error, data } = useQuery<D, Variables & {}>(recommendationQuery, {
    variables,
    notifyOnNetworkStatusChange: true,
  })
  return { error, data }
}

// create Product type
interface Recommendation {
  base: any[]
  recommended: any[]
}

interface RecommendationResponse {
  recommendations: Recommendation[]
}

interface RecommendationAPI {
  response: RecommendationResponse
}

interface Data {
  recommendation: RecommendationAPI
}

interface Variables {
  input: {
    sessionId: string
    request: {
      strategy: string
      input: InputRecommendation
      recommendation: RecommendationOptions
    }
  }
}

export default useRecommendation

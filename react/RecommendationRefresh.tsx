import React, { useEffect, useState, Fragment } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'

import { useAnonymous } from './utils/useAnonymous'
import { buildInputByStrategy } from './utils/buildInput'
import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const RecommendationRefresh: StorefrontFunctionComponent<Props> = ({
  strategy,
  // secondaryStrategy,
  recommendation,
}) => {
  const { account } = useRuntime()
  const { anonymous } = useAnonymous(account)
  const [recommendations, setRecommendations] = useState<Recommendation[]>()
  const input = buildInputByStrategy(strategy, undefined, undefined, anonymous)

  const { data } = useRecommendation(strategy, input, recommendation)

  useEffect(() => {
    const recommendations = data?.recommendation?.response?.recommendations
    if (recommendations) {
      setRecommendations(recommendations)
    }
  }, [data])

  return recommendations ? (
    <ExtensionPoint id="refresh-shelf" recommendedLists={recommendations} />
  ) : (
    <Fragment />
  )
}

RecommendationRefresh.schema = {
  title: 'admin/recommendation-refresh-shelf.title',
}

export default RecommendationRefresh

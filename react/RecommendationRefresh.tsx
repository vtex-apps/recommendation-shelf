import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'

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
  const { data, error } = useRecommendation(
    strategy,
    recommendation,
    undefined,
    undefined
  )

  const recommendations = useMemo(() => {
    if (error) {
      return undefined
    }
    const recommendations = data?.recommendation?.response?.recommendations
    if (recommendations) {
      return recommendations
    }
    return undefined
  }, [error, data])

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

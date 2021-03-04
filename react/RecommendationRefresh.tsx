import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { RecommendationProvider } from 'vtex.recommendation-context/RecommendationContext'

import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const RecommendationRefresh: StorefrontFunctionComponent<Props> = ({
  strategy,
  secondaryStrategy,
  recommendation,
}) => {
  const { data, error, isSecondary } = useRecommendation(
    strategy,
    recommendation,
    undefined,
    undefined,
    secondaryStrategy
  )

  const recommendations = useMemo(() => {
    if (error) {
      return undefined
    }

    const rec = data?.recommendation?.response?.recommendations

    if (rec) {
      return rec
    }

    return undefined
  }, [error, data])

  return recommendations ? (
    <RecommendationProvider shouldSendEvents>
      <ExtensionPoint
        isSecondary={isSecondary}
        id="refresh-shelf"
        recommendedLists={recommendations}
      />
    </RecommendationProvider>
  ) : (
    <Fragment />
  )
}

RecommendationRefresh.schema = {
  title: 'admin/recommendation-refresh-shelf.title',
}

export default RecommendationRefresh

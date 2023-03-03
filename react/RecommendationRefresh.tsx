import React, { Fragment } from 'react'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const RecommendationRefresh: StorefrontFunctionComponent<Props> = () => {
  console.warn(
    `"RecommendationRefreshShelf" is deprecated, please do not use it.`
  )

  return <Fragment />
}

RecommendationRefresh.schema = {
  title: 'admin/recommendation-refresh-shelf.title',
}

export default RecommendationRefresh

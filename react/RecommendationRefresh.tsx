import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  strategy?: string
  secondaryStrategy?: string
  recommendation?: Recommendation
}

const RecommendationRefresh: StorefrontFunctionComponent<Props> = ({
  strategy,
  secondaryStrategy,
  recommendation,
}) => {
  // eslint-disable-next-line no-console
  console.log(strategy, secondaryStrategy, recommendation)
  return <ExtensionPoint id="refresh-shelf" />
}

RecommendationRefresh.schema = {
  title: 'admin/recommendation-refresh-shelf.title',
}

export default RecommendationRefresh

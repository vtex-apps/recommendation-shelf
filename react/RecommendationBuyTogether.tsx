import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  strategy?: string
  recommendation?: Recommendation
}

const RecommendationBuyTogether: StorefrontFunctionComponent<Props> = ({
  strategy,
  recommendation,
}) => {
  // eslint-disable-next-line no-console
  console.log(strategy, recommendation)
  return <ExtensionPoint id="buy-together" />
}

RecommendationBuyTogether.schema = {
  title: 'admin/recommendation-buy-together.title',
}

export default RecommendationBuyTogether

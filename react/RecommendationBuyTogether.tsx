import React, { Fragment } from 'react'

interface Props {
  strategy: string
  recommendation: RecommendationOptions
}

const RecommendationBuyTogether: StorefrontFunctionComponent<Props> = () => {
  console.warn(
    `"RecommendationBuyTogether" is deprecated, please do not use it.`
  )

  return <Fragment />
}

RecommendationBuyTogether.schema = {
  title: 'admin/recommendation-buy-together.title',
}

export default RecommendationBuyTogether

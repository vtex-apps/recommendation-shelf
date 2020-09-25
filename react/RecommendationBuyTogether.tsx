import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  recommendation: RecommendationOptions
}

const RecommendationBuyTogether: StorefrontFunctionComponent<Props> = ({
  strategy,
  recommendation,
}) => {
  const productContext = useProduct()
  const [productIds, setProductIds] = useState<string[]>()

  useEffect(() => {
    if (productContext) {
      const { product } = productContext
      if (product) {
        setProductIds([product.productId])
      }
    }
  }, [productContext])

  const { data, error } = useRecommendation(
    strategy,
    recommendation,
    productIds,
    undefined
  )

  const recommendations = useMemo(() => {
    if (error) {
      return undefined
    }
    const response = data?.recommendation?.response?.recommendations
    if (response) {
      const recommendedLists = response.map(
        (recommendation: Recommendation) => recommendation.recommended
      )
      return recommendedLists
    }
    return undefined
  }, [error, data])

  return recommendations && recommendations.length > 0 ? (
    <ExtensionPoint id="buy-together" suggestedProducts={recommendations} />
  ) : (
    <Fragment />
  )
}

RecommendationBuyTogether.schema = {
  title: 'admin/recommendation-buy-together.title',
}

export default RecommendationBuyTogether

import React, { Fragment, useEffect, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { buildInputByStrategy } from './utils/buildInput'
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
  const [recommendations, setRecommendations] = useState<Product[][]>()
  const [productIds, setProductIds] = useState<string[]>()

  useEffect(() => {
    if (productContext) {
      const { product } = productContext
      if (product) {
        setProductIds([product.productId])
      }
    }
  }, [productContext])

  const input = buildInputByStrategy(strategy, productIds, undefined, undefined)

  const { data } = useRecommendation(strategy, input, recommendation)

  useEffect(() => {
    const response = data?.recommendation?.response?.recommendations
    if (response) {
      const recommendedLists = response.map(
        (recommendation: Recommendation) => recommendation.recommended
      )
      setRecommendations(recommendedLists)
    }
  }, [data])

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

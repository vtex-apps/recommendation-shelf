import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { RecommendationProvider } from 'vtex.recommendation-context/RecommendationContext'

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
    productIds
  )

  const recommendations = useMemo(() => {
    if (error) {
      return undefined
    }

    const response = data?.recommendation?.response?.recommendations

    if (response?.length) {
      const allRecommendations = response[0].recommended

      if (!allRecommendations?.length) {
        return undefined
      }

      const divider = allRecommendations.length / 2

      return [
        allRecommendations.slice(0, divider),
        allRecommendations.slice(divider),
      ]
    }

    return undefined
  }, [error, data])

  return recommendations?.length ? (
    <RecommendationProvider shouldSendEvents>
      <ExtensionPoint id="buy-together" suggestedProducts={recommendations} />
    </RecommendationProvider>
  ) : (
    <Fragment />
  )
}

RecommendationBuyTogether.schema = {
  title: 'admin/recommendation-buy-together.title',
}

export default RecommendationBuyTogether

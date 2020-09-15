import React, { useEffect, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

enum RequestInputType {
  USER = 'USER',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  TAG_GROUP = 'TAG_GROUP',
  CAMPAIGN = 'CAMPAIGN',
  GROUP = 'GROUP',
  ANONYMOUS_USER = 'ANONYMOUS_USER',
  BRAND = 'BRAND',
  STORE = 'STORE',
}

const Shelf: StorefrontFunctionComponent<Props> = ({
  strategy,
  // secondaryStrategy,
  recommendation,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  // resolver o input
  const input = {
    type: { primary: RequestInputType.PRODUCT },
    values: ['903782'],
  }

  const { error, data } = useRecommendation(strategy, input, recommendation)

  useEffect(() => {
    const recommended =
      data?.recommendation?.response?.recommendations?.[0].recommended
    if (recommended && recommended.length > 1) {
      setProducts(recommended)
    }
  }, [data?.recommendation.response.recommendations])

  // eslint-disable-next-line no-console
  console.log(error, data)
  return <ExtensionPoint id="default-shelf" products={products} />
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

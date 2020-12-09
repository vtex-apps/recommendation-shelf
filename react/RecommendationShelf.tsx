import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useProduct } from 'vtex.product-context'
import { RecommendationProvider } from 'vtex.recommendation-context/RecommendationContext'

import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const Shelf: StorefrontFunctionComponent<Props> = ({
  strategy,
  secondaryStrategy,
  recommendation,
}) => {
  const { searchQuery } = useSearchPage()
  const productContext = useProduct()

  let productIds: string[] | undefined = undefined
  let categories: string[] | undefined = undefined

  if (productContext) {
    const { product } = productContext
    if (product) {
      productIds = [product.productId]
    }
  }

  if (searchQuery) {
    const category: FacetValue | undefined =
      searchQuery?.facets?.categoriesTrees?.[0]

    const selected = category?.children?.find(
      (child: FacetValue) => child.selected
    )
    categories = category ? [selected ? selected.id : category.id] : undefined

    productIds = searchQuery?.products
      ?.slice(0, 5)
      .map((product: Product) => product.productId)
  }

  const { data, error } = useRecommendation(
    strategy,
    recommendation,
    productIds,
    categories,
    secondaryStrategy
  )

  const products = useMemo(() => {
    if (error) {
      return undefined
    }
    const recommended =
      data?.recommendation?.response?.recommendations?.[0].recommended
    if (recommended && recommended.length > 0) {
      return recommended
    }
    return undefined
  }, [data?.recommendation.response.recommendations, error])

  return products?.length ? (
    <RecommendationProvider shouldSendEvents>
      <ExtensionPoint id="default-shelf" products={products} />
    </RecommendationProvider>
  ) : (
    <Fragment />
  )
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

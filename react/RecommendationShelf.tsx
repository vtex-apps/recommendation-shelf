import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useProduct } from 'vtex.product-context'

import useRecommendation from './hooks/useRecommendation'
import { useAnonymous } from './utils/useAnonymous'
import { buildInputByStrategy } from './utils/buildInput'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const Shelf: StorefrontFunctionComponent<Props> = ({
  strategy,
  // secondaryStrategy,
  recommendation,
}) => {
  const { account } = useRuntime()
  const { anonymous } = useAnonymous(account)
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
    const category = searchQuery?.facets?.categoriesTrees?.[0]
    const selected = category?.children.find((child: any) => child.selected)
    categories = [selected ? selected.id : category.id]

    productIds = searchQuery?.products
      ?.slice(0, 5)
      .map((product: Product) => product.productId)
  }

  const input = buildInputByStrategy(
    strategy,
    productIds,
    categories,
    anonymous
  )

  const { data, error } = useRecommendation(strategy, input, recommendation)

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

  return products && products.length > 0 ? (
    <ExtensionPoint id="default-shelf" products={products} />
  ) : (
    <Fragment />
  )
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

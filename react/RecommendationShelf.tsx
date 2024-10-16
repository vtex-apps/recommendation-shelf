import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useProduct } from 'vtex.product-context'
import { RecommendationProvider } from 'vtex.recommendation-context/RecommendationContext'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import useRecommendation from './hooks/useRecommendation'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
  campaignId: string
}

const Shelf: StorefrontFunctionComponent<Props> = ({
  strategy,
  secondaryStrategy,
  recommendation,
  campaignId,
}) => {
  const { searchQuery } = useSearchPage()
  const productContext = useProduct()
  const { page } = useRuntime()
  const {
    orderForm: { items: orderFormItems },
  } = useOrderForm()

  let productIds: string[] | undefined
  let categories: string[] | undefined

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
  } else if (orderFormItems && page === 'store.checkout.cart') {
    productIds = orderFormItems?.map((item: any) => item.id)
  }

  const { data, error, isSecondary } = useRecommendation(
    strategy,
    recommendation,
    productIds,
    categories,
    secondaryStrategy,
    campaignId
  )

  const products = useMemo(() => {
    if (error) {
      return undefined
    }

    const recommended = (data as any)?.recommendation?.products

    if (recommended && recommended.length > 0) {
      return recommended
    }

    return undefined
  }, [data, error])

  return products?.length ? (
    <RecommendationProvider shouldSendEvents>
      <ExtensionPoint
        isSecondary={isSecondary}
        id="default-shelf"
        products={products}
      />
    </RecommendationProvider>
  ) : (
    <Fragment />
  )
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

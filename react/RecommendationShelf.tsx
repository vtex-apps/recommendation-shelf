import React, { Fragment, useMemo } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useProduct } from 'vtex.product-context'
import { RecommendationProvider } from 'vtex.recommendation-context/RecommendationContext'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import useRecommendation from './hooks/useRecommendation'

type Props = {
  campaignId: string
}

const Shelf: StorefrontFunctionComponent<Props> = ({ campaignId }) => {
  const { searchQuery } = useSearchPage()
  const productContext = useProduct()
  const { page } = useRuntime()
  const {
    orderForm: { items: orderFormItems },
  } = useOrderForm()

  let productId: string | undefined

  if (productContext) {
    const { product } = productContext

    if (product) {
      productId = product.productId
    }
  }

  if (searchQuery) {
    productId = searchQuery?.products[0]?.productId
  } else if (orderFormItems && page === 'store.checkout.cart') {
    productId = orderFormItems?.map((item: any) => item.id)[0]
  }

  const { data, error } = useRecommendation(campaignId, productId)

  const products = useMemo(() => {
    if (error || !data) {
      return undefined
    }

    const recommended = data.syneriseRecommendationV1.products

    if (recommended && recommended.length > 0) {
      return recommended
    }

    return undefined
  }, [data, error])

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

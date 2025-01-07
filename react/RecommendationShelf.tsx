import React, { Fragment, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import useRecommendation from './hooks/useRecommendation'
import Shelf from './Shelf'

defineMessages({
  title: {
    id: 'admin/recommendation-shelf.title',
    defaultMessage: 'Recommendation Shelf',
  },
})

type Props = {
  campaignId: string
  title?: string
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignId,
  title,
}) => {
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
    <Shelf
      products={products}
      title={title}
      correlationId={data?.syneriseRecommendationV1.correlationId ?? ''}
    />
  ) : (
    <Fragment />
  )
}

RecommendationShelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default RecommendationShelf

import React, { Fragment, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import useRecommendation from './hooks/useRecommendation'
import Shelf from './Shelf'
import type { RecommendationVrnType } from './utils/vrn'
import { parseCampaignVrn } from './utils/vrn'
import { withRecommendationShelfErrorBoundary } from './errors/RecommendationShelfErrorBoundary'

defineMessages({
  title: {
    id: 'admin/recommendation-shelf.title',
    defaultMessage: 'Recommendation Shelf',
  },
})

type ProductContext = 'empty' | 'cart' | 'productPage'

const RecommendationToProductMapping: Record<
  RecommendationVrnType,
  ProductContext
> = {
  'rec-cross-v1': 'cart',
  'rec-similar-v1': 'productPage',
  'rec-cart-v1': 'cart',
  'rec-persona-v1': 'empty',
  'rec-last-v1': 'empty',
  'rec-top-items-v1': 'empty',
}

type Props = {
  campaignVrn?: string
  title?: string
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
}) => {
  const productContext = useProduct()
  const {
    orderForm: { items: orderFormItems },
  } = useOrderForm()

  const { campaignType } = useMemo(() => {
    const result = parseCampaignVrn(campaignVrn)

    return { campaignId: result.campaignId, campaignType: result.campaignType }
  }, [campaignVrn])

  const productSource: Record<ProductContext, string[]> = {
    cart: orderFormItems?.map((item: any) => item.id) ?? [],
    productPage: [productContext?.product?.productId ?? ''],
    empty: [],
  }

  const productsIds =
    productSource[RecommendationToProductMapping[campaignType]]

  const { data, error } = useRecommendation({
    campaignVrn,
    products: productsIds,
  })

  const products = useMemo(() => {
    if (error || !data) {
      return undefined
    }

    const recommended = data.recommendationsV1.products

    if (recommended && recommended.length > 0) {
      return recommended
    }

    return undefined
  }, [data, error])

  return products?.length && campaignVrn ? (
    <Shelf
      products={products}
      title={title}
      correlationId={data?.recommendationsV1.correlationId ?? ''}
      campaignVrn={campaignVrn}
    />
  ) : (
    <Fragment />
  )
}

RecommendationShelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default withRecommendationShelfErrorBoundary<Props>(RecommendationShelf)

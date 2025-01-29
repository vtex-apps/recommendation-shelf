import React, { Fragment, useMemo } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { canUseDOM } from 'vtex.render-runtime'

import useRecommendation from '../hooks/useRecommendation'
import Shelf from './Shelf'
import type { RecommendationVrnType } from '../utils/vrn'
import { isValidVrn, parseCampaignVrn } from '../utils/vrn'
import { getUserIdFromCookie } from '../utils/user'

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
  'rec-recent-int-v1': 'empty',
  'rec-top-items-v1': 'empty',
}

function getContextFromType(type: string) {
  const result = RecommendationToProductMapping[type as RecommendationVrnType]

  return result ?? 'empty'
}

type Props = {
  campaignVrn?: string
  title?: string
}

export const RecommendationShelfContainer: React.FC<Props> = ({
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
    cart:
      orderFormItems?.map((item: { productId: string }) => item.productId) ??
      [],
    productPage: [productContext?.product?.productId ?? ''],
    empty: [],
  }

  const userId = canUseDOM ? getUserIdFromCookie() : ''

  const productsIds = productSource[getContextFromType(campaignType)]

  const { data, error, loading } = useRecommendation({
    userId,
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

  if (!userId) {
    console.warn('Shelf not displayed due to missing userId', {
      userId,
      campaignVrn,
    })
  }

  if (!campaignVrn || !isValidVrn(campaignVrn)) {
    console.warn('Shelf not displayed due to invalid campaignVrn', {
      campaignVrn,
    })
  }

  if (!products?.length && loading === false) {
    console.warn('Shelf not displayed due to missing products or an error', {
      products,
      campaignVrn,
      error,
    })
  }

  return products?.length && campaignVrn ? (
    <Shelf
      products={products}
      title={title}
      correlationId={data?.recommendationsV1.correlationId ?? ''}
      campaignVrn={campaignVrn}
      userId={userId}
    />
  ) : (
    <Fragment />
  )
}

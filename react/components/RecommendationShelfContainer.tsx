import React, { Fragment, useMemo } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { canUseDOM } from 'vtex.render-runtime'

import useRecommendation from '../hooks/useRecommendation'
import Shelf from './Shelf'
import { getTypeFromVrn, isValidVrn } from '../utils/vrn'
import { getUserIdFromCookie } from '../utils/user'

type ProductContext = 'empty' | 'cart' | 'productPage'

const RecommendationToProductMapping: Record<
  RecommendationType,
  ProductContext
> = {
  SIMILAR_ITEMS: 'productPage',
  PERSONALIZED: 'empty',
  CROSS_SELL: 'productPage',
  LAST_SEEN: 'empty',
  TOP_ITEMS: 'empty',
}

function getContextFromType(type: RecommendationType) {
  const result = RecommendationToProductMapping[type]

  return result ?? 'empty'
}

type Props = {
  campaignVrn?: string
  title?: string
  recommendationType: RecommendationType
}

export const RecommendationShelfContainer: React.FC<Props> = ({
  recommendationType,
  campaignVrn,
  title,
}) => {
  const productContext = useProduct()
  const {
    orderForm: { items: orderFormItems },
  } = useOrderForm()

  const { campaignType } = useMemo(() => {
    if (campaignVrn) {
      return { campaignType: getTypeFromVrn(campaignVrn) }
    }

    return { campaignType: recommendationType }
  }, [campaignVrn, recommendationType])

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
    campaignType,
    products: productsIds,
  })

  const products = useMemo(() => {
    if (error || !data) {
      return undefined
    }

    const recommended = data.recommendationsV2.products

    if (recommended && recommended.length > 0) {
      return recommended
    }

    return undefined
  }, [data, error])

  if (!userId) {
    console.warn(
      '[vtex.recommendation-shelf@2.x] Shelf might not displayed due to missing userId',
      {
        userId,
        campaignVrn,
        campaignType,
      }
    )
  }

  if (campaignVrn && !isValidVrn(campaignVrn)) {
    console.warn(
      '[vtex.recommendation-shelf@2.x] Shelf not displayed due to invalid campaignVrn',
      {
        campaignVrn,
        campaignType,
      }
    )
  }

  if (!products?.length && loading === false) {
    console.warn(
      '[vtex.recommendation-shelf@2.x] Shelf not displayed due to missing products or an error',
      {
        products,
        campaignVrn,
        error,
      }
    )
  }

  return products?.length ? (
    <Shelf
      products={products}
      title={title ?? data?.recommendationsV2.campaign.title ?? ''}
      correlationId={data?.recommendationsV2.correlationId ?? ''}
      userId={userId}
    />
  ) : (
    <Fragment />
  )
}

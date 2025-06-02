import React, { Fragment, useMemo, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { canUseDOM } from 'vtex.render-runtime'

import useRecommendation from '../hooks/useRecommendation'
import Shelf from './Shelf'
import { getTypeFromVrn, isValidVrn } from '../utils/vrn'
import { getUserIdFromCookie } from '../utils/user'
import { getWithRetry } from '../utils/getWithRetry'

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

  const [userId, setUserId] = useState<string | null>(null)

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

  if (canUseDOM && !userId) {
    // The pixel might take a while to load and set the userId cookie,
    // so we use a retry mechanism to ensure we get the userId if available.
    getWithRetry<string>(() => {
      if (canUseDOM && !userId) {
        return getUserIdFromCookie()
      }

      return ''
    })
      .then((value) => {
        setUserId(value)
      })
      .catch((error) => {
        console.error(
          '[vtex.recommendation-shelf@2.x] Error retrieving userId from cookie',
          error,
          campaignType
        )
      })
  }

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

  return products?.length && userId ? (
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

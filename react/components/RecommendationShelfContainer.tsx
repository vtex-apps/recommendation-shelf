import React, { Fragment, useMemo, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { canUseDOM } from 'vtex.render-runtime'

import useRecommendations from '../hooks/useRecommendations'
import Shelf from './Shelf'
import { getTypeFromVrn, isValidVrn } from '../utils/vrn'
import { getUserIdFromCookie } from '../utils/user'
import { getWithRetry } from '../utils/getWithRetry'
import { logger } from '../utils/logger'
import { ShelfSkeleton } from './ShelfSkeleton'

type Props = {
  campaignVrn?: string
  title?: string
  recommendationType?: RecommendationType
  displayTitle: boolean
  itemsContext: ItemContextType[]
}

export const RecommendationShelfContainer: React.FC<Props> = ({
  recommendationType,
  campaignVrn,
  title,
  displayTitle,
  itemsContext = ['PDP'],
}) => {
  const productContext = useProduct()
  const {
    orderForm: { items: orderFormItems },
  } = useOrderForm()

  const [userId, setUserId] = useState<string | null | undefined>(undefined)

  const { campaignType } = useMemo(() => {
    if (campaignVrn) {
      return { campaignType: getTypeFromVrn(campaignVrn) }
    }

    return { campaignType: recommendationType }
  }, [campaignVrn, recommendationType])

  const cartItems: string[] =
    orderFormItems?.map((item: { productId: string }) => item.productId) ?? []

  const currentProduct = productContext?.product?.productId

  // Compose product IDs based on itemsContext
  let productsIds: string[] = []

  if (itemsContext.includes('PDP') && currentProduct) {
    productsIds.push(currentProduct)
  }

  if (itemsContext.includes('CART')) {
    productsIds = productsIds.concat(cartItems)
  }

  // Remove duplicates and falsy values
  productsIds = Array.from(new Set(productsIds)).filter(Boolean)

  if (canUseDOM && !userId && userId !== null) {
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
        logger.error({
          message: 'Error retrieving userId from cookie',
          data: { error, campaignType },
          sendLog: true,
        })
        setUserId(null)
      })
  }

  const { data, error, loading } = useRecommendations({
    userId,
    campaignVrn,
    recommendationType: campaignType,
    products: productsIds,
  })

  const products = useMemo(() => {
    if (error || !data) {
      return undefined
    }

    const recommended = data.products

    if (recommended && recommended.length > 0) {
      return recommended
    }

    return undefined
  }, [data, error])

  if (loading || userId === undefined) {
    return <ShelfSkeleton />
  }

  if (campaignVrn && !isValidVrn(campaignVrn)) {
    logger.warn({
      message: 'Shelf not displayed due to invalid campaignVrn',
      data: { campaignVrn, campaignType },
    })
  }

  if ((products && products.length === 0 && loading === false) || error) {
    logger.warn({
      message: 'Shelf not displayed due to missing products or an error',
      data: { products, campaignVrn, error },
    })
  }

  return products?.length && userId ? (
    <Shelf
      products={products}
      title={title ?? data?.campaign.title ?? ''}
      correlationId={data?.correlationId ?? ''}
      userId={userId}
      displayTitle={displayTitle}
    />
  ) : (
    <Fragment />
  )
}

import { useEffect, useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import type { Product } from 'recommend-bff'

import { getCookie, startSession } from '../utils/user'

const USER_START_SESSION_COOKIE = 'vtex-rec-user-start-session'

type Params = {
  products: Product[]
  correlationId: string
  campaignId: string
}

/**
 * Shared analytics wiring for the shelf views: starts the user session once
 * and builds the `data-af-*` attributes for the container and each product.
 */
export function useShelfTracking({
  products,
  correlationId,
  campaignId,
}: Params) {
  const { account } = useRuntime()

  useEffect(() => {
    const sessionCookie = getCookie(USER_START_SESSION_COOKIE)

    if (!sessionCookie) {
      startSession({ account })
    }
  }, [account])

  const productIds = useMemo(
    () => products.map((p) => p.productId).join(', '),
    [products]
  )

  const shouldAddAFAttr = !!(correlationId && campaignId && productIds.length)

  function buildExtraProductProps(
    product?: Record<string, string>,
    index?: number
  ) {
    return {
      'data-af-element': 'recommendation-shelf-product',
      'data-af-correlation-id': correlationId,
      'data-af-campaign-id': campaignId,
      'data-af-product-id': product?.productId,
      'data-af-onclick': !!product?.productId,
      'data-af-product-position': (index ?? 0) + 1,
    }
  }

  const containerAttributes = {
    'data-af-element': 'recommendation-shelf',
    'data-af-onimpression': shouldAddAFAttr,
    'data-af-onview': shouldAddAFAttr,
    'data-af-correlation-id': shouldAddAFAttr && correlationId,
    'data-af-campaign-id': shouldAddAFAttr && campaignId,
    'data-af-products': shouldAddAFAttr && productIds,
  }

  return {
    containerAttributes,
    buildExtraProductProps: shouldAddAFAttr
      ? buildExtraProductProps
      : undefined,
  }
}

import { useMemo } from 'react'
import type { Product } from 'recommend-bff'

type Params = {
  products: Product[]
  correlationId: string
  campaignId: string
}

/**
 * Shared analytics wiring for the shelf views. Builds the `data-af-*`
 * attributes for the container and each product. The control-group script
 * registers the session, so this hook does not call start-session.
 */
export function useShelfTracking({
  products,
  correlationId,
  campaignId,
}: Params) {
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

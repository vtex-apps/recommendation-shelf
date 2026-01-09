import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { notifyClick } from './notifyClick'
import { notifyView } from './notifyView'
import { attachViewEvent } from '../../utils/attachViewEvent'

type Props = {
  userId: string
  correlationId: string
  products: Product[]
  displayTitle: boolean
  title?: string
  campaignId: string
}

const CSS_HANDLES = [
  'recommendationShelfContainer',
  'shelfTitleContainer',
  'shelfTitle',
]

const Shelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  userId,
  displayTitle,
  campaignId,
}) => {
  const shelfDivRef = useRef<HTMLDivElement>(null)
  const handles = useCssHandles(CSS_HANDLES)
  const { account } = useRuntime()

  const onProductClick = useCallback(
    (p: Product) => {
      const itemId = p.productId ?? ''

      notifyClick({
        productId: itemId,
        correlationId,
        userId,
        account,
        campaignId,
      })
    },
    [correlationId, userId, account, campaignId]
  )

  const onView = useCallback(() => {
    notifyView({
      userId,
      correlationId,
      products: products.map((p) => p.productId ?? ''),
      account,
      campaignId,
    })
  }, [products, userId, correlationId, account, campaignId])

  useEffect(() => {
    const currentShelfDiv = shelfDivRef.current

    if (!currentShelfDiv) return

    attachViewEvent(currentShelfDiv, `${correlationId}`)
    currentShelfDiv.addEventListener('view', onView)

    return () => {
      // Remove listener on unmount to avoid multiple calls
      currentShelfDiv.removeEventListener('view', onView)
    }
  }, [shelfDivRef, products, userId, correlationId, onView])

  const productIds = useMemo(
    () => products.map((p) => p.productId).join(', '),
    [products]
  )

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

  const shouldAddAFAttr = !!(correlationId && campaignId && productIds.length)

  return (
    <div
      className={`${handles.recommendationShelfContainer}`}
      ref={shelfDivRef}
      data-af-element="recommendation-shelf"
      data-af-onimpression={shouldAddAFAttr}
      data-af-correlation-id={shouldAddAFAttr && correlationId}
      data-af-campaign-id={shouldAddAFAttr && campaignId}
      data-af-products={shouldAddAFAttr && productIds}
    >
      {title && displayTitle && (
        <div className={`mv4 tc v-mid ${handles.shelfTitleContainer}`}>
          <span className={`${styles.shelfTitle} ${handles.shelfTitle}`}>
            {title}
          </span>
        </div>
      )}
      <ExtensionPoint
        id="list-context.product-list-static"
        products={products}
        actionOnProductClick={onProductClick}
        buildExtraProductProps={
          shouldAddAFAttr ? buildExtraProductProps : undefined
        }
      />
    </div>
  )
}

export default Shelf

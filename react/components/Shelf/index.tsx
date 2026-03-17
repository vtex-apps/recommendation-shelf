import React, { useEffect, useMemo } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { getCookie, startSession } from '../../utils/user'

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

const USER_START_SESSION_COOKIE = 'vtex-rec-user-start-session'

const Shelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  displayTitle,
  campaignId,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
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
      data-af-element="recommendation-shelf"
      data-af-onimpression={shouldAddAFAttr}
      data-af-onview={shouldAddAFAttr}
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
        buildExtraProductProps={
          shouldAddAFAttr ? buildExtraProductProps : undefined
        }
      />
    </div>
  )
}

export default Shelf

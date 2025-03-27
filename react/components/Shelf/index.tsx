import React, { useEffect, useRef, useCallback } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import type { Product } from '../graphql/QueryRecommendationShelf.gql'
import styles from './styles.css'
import { notifyClick } from './notifyClick'
import { notifyView } from './notifyView'
import { attachViewEvent } from '../../utils/attachViewEvent'

type Props = {
  userId: string
  campaignVrn: string
  correlationId: string
  products: Product[]
  title?: string
}

const CSS_HANDLES = ['shelfTitleContainer', 'shelfTitle']

const Shelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  campaignVrn,
  userId,
}) => {
  const shelfDivRef = useRef<HTMLDivElement>(null)
  const handles = useCssHandles(CSS_HANDLES)

  const onProductClick = useCallback(
    (p: Product) => {
      const itemId = p.productId ?? ''

      notifyClick({ productId: itemId, campaignVrn, correlationId, userId })
    },
    [campaignVrn, correlationId, userId]
  )

  const onView = useCallback(() => {
    notifyView({
      userId,
      correlationId,
      products: products.map((p) => p.productId ?? ''),
    })
  }, [products, userId, correlationId])

  useEffect(() => {
    const currentShelfDiv = shelfDivRef.current

    if (!currentShelfDiv) return

    attachViewEvent(currentShelfDiv, `${campaignVrn}-${correlationId}`)
    currentShelfDiv.addEventListener('view', onView)

    return () => {
      // Remove listener on unmount to avoid multiple calls
      currentShelfDiv.removeEventListener('view', onView)
    }
  }, [shelfDivRef, campaignVrn, products, userId, correlationId, onView])

  return (
    <div ref={shelfDivRef}>
      {title && (
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
      />
    </div>
  )
}

export default Shelf

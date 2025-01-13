import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import type { Product } from '../graphql/QueryRecommendationShelf.gql'
import styles from './styles.css'
import { notifyClick } from './notifyClick'

type Props = {
  campaignId: string
  correlationId: string
  products: Product[]
  title?: string
}

const CSS_HANDLES = ['shelfTitleContainer', 'shelfTitle']

const Shelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  campaignId,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const onProductClick = (p: Product) => {
    const itemId = p.productId ?? ''

    notifyClick({ itemId, campaignId, correlationId })
  }

  return (
    <div className="flex-none tc">
      {title && (
        <div className={`mv4 v-mid ${handles.shelfTitleContainer}`}>
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

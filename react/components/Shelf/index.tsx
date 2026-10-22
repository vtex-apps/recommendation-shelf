import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { useShelfTracking } from '../../hooks/useShelfTracking'

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
  displayTitle,
  campaignId,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { containerAttributes, buildExtraProductProps } = useShelfTracking({
    products,
    correlationId,
    campaignId,
  })

  return (
    <div
      className={`${handles.recommendationShelfContainer}`}
      {...containerAttributes}
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
        buildExtraProductProps={buildExtraProductProps}
      />
    </div>
  )
}

export default Shelf

import type { ReactNode } from 'react'
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { useShelfTracking } from '../../hooks/useShelfTracking'
import { MiniShelfProductList } from './ProductList'

// TODO: internationalize these labels (messages/*.json) instead of using static English
const COLLAPSE_LABEL = 'Collapse recommendations'
const EXPAND_LABEL = 'Expand recommendations'

type Props = {
  userId: string
  correlationId: string
  products: Product[]
  displayTitle: boolean
  title?: string
  campaignId: string
  children?: ReactNode
}

const CSS_HANDLES = [
  'recMiniShelfContainer',
  'recMiniShelfCollapsed',
  'recMiniShelfHeader',
  'recMiniShelfTitle',
  'recMiniShelfToggle',
  'recMiniShelfToggleIcon',
  'recMiniShelfContent',
]

const CONTENT_ID = 'recommendation-mini-shelf-content'

const MiniShelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  displayTitle,
  campaignId,
  children,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  // Plain React state on purpose: the choice is not persisted across mounts.
  const [collapsed, setCollapsed] = useState(false)
  const { containerAttributes, buildExtraProductProps } = useShelfTracking({
    products,
    correlationId,
    campaignId,
  })

  const showTitle = Boolean(title && displayTitle)

  return (
    <div
      className={`${handles.recMiniShelfContainer} ${styles.container} ${
        collapsed ? `${handles.recMiniShelfCollapsed} ${styles.collapsed}` : ''
      }`}
      {...containerAttributes}
    >
      <button
        type="button"
        className={`${handles.recMiniShelfToggle} ${styles.toggle} ${handles.recMiniShelfHeader} bg-base c-on-base bn pointer`}
        aria-expanded={!collapsed}
        aria-controls={CONTENT_ID}
        aria-label={collapsed ? EXPAND_LABEL : COLLAPSE_LABEL}
        onClick={() => setCollapsed((current) => !current)}
      >
        <span className={`${styles.title} ${handles.recMiniShelfTitle}`}>
          {showTitle ? title : ''}
        </span>
        <svg
          className={`${styles.icon} ${collapsed ? styles.iconCollapsed : ''} ${
            handles.recMiniShelfToggleIcon
          }`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 8 11 13 6" />
        </svg>
      </button>
      {!collapsed && (
        <div id={CONTENT_ID} className={handles.recMiniShelfContent}>
          <MiniShelfProductList
            products={products}
            buildExtraProductProps={buildExtraProductProps}
          >
            {children}
          </MiniShelfProductList>
        </div>
      )}
    </div>
  )
}

export default MiniShelf

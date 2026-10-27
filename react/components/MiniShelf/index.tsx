import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { useShelfTracking } from '../../hooks/useShelfTracking'
import { MiniShelfProductList } from './ProductList'

// TODO: internationalize these labels (messages/*.json) instead of using static English
const COLLAPSE_LABEL = 'Collapse recommendations'
const EXPAND_LABEL = 'Expand recommendations'
const COLLAPSED_STORAGE_KEY = 'vtex.recommendation-shelf:mini-shelf-collapsed'

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
  const [collapsed, setCollapsed] = useState(false)
  const { containerAttributes, buildExtraProductProps } = useShelfTracking({
    products,
    correlationId,
    campaignId,
  })

  const showTitle = Boolean(title && displayTitle)

  useEffect(() => {
    try {
      setCollapsed(
        window.sessionStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true'
      )
    } catch {
      // The shelf starts expanded when storage is unavailable.
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current

      try {
        window.sessionStorage.setItem(COLLAPSED_STORAGE_KEY, String(next))
      } catch {
        // The shelf still works when storage is unavailable.
      }

      return next
    })
  }

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
        onClick={toggleCollapsed}
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

import React, { useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages, useIntl } from 'react-intl'
import type { Product } from 'recommend-bff'

import styles from './styles.css'
import { useShelfTracking } from '../../hooks/useShelfTracking'

const messages = defineMessages({
  collapse: {
    id: 'store/recommendation-mini-shelf.collapse',
    defaultMessage: 'Collapse recommendations',
  },
  expand: {
    id: 'store/recommendation-mini-shelf.expand',
    defaultMessage: 'Expand recommendations',
  },
})

type Props = {
  userId: string
  correlationId: string
  products: Product[]
  displayTitle: boolean
  title?: string
  campaignId: string
}

const CSS_HANDLES = [
  'miniShelfContainer',
  'miniShelfCollapsed',
  'miniShelfHeader',
  'miniShelfTitle',
  'miniShelfToggle',
  'miniShelfToggleIcon',
  'miniShelfContent',
]

const CONTENT_ID = 'recommendation-mini-shelf-content'

const MiniShelf: StorefrontFunctionComponent<Props> = ({
  title,
  products,
  correlationId,
  displayTitle,
  campaignId,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
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
      className={`${handles.miniShelfContainer} ${styles.container} ${
        collapsed ? `${handles.miniShelfCollapsed} ${styles.collapsed}` : ''
      }`}
      {...containerAttributes}
    >
      <button
        type="button"
        className={`${handles.miniShelfToggle} ${styles.toggle} ${handles.miniShelfHeader} bg-base c-on-base bn pointer`}
        aria-expanded={!collapsed}
        aria-controls={CONTENT_ID}
        aria-label={intl.formatMessage(
          collapsed ? messages.expand : messages.collapse
        )}
        onClick={() => setCollapsed((current) => !current)}
      >
        <span className={`${styles.title} ${handles.miniShelfTitle}`}>
          {showTitle ? title : ''}
        </span>
        <svg
          className={`${styles.icon} ${collapsed ? styles.iconCollapsed : ''} ${
            handles.miniShelfToggleIcon
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
        <div id={CONTENT_ID} className={handles.miniShelfContent}>
          <ExtensionPoint
            id="list-context.product-list-static"
            products={products}
            buildExtraProductProps={buildExtraProductProps}
          />
        </div>
      )}
    </div>
  )
}

export default MiniShelf

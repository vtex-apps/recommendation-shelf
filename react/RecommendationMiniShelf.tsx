import type { ReactNode } from 'react'
import React from 'react'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import RecommendationShelf from './RecommendationShelf'
import { RecommendationShelfErrorBoundary } from './components/RecommendationShelfErrorBoundary'
import { RecommendationShelfContainer } from './components/RecommendationShelfContainer'
import { isPathHidden } from './utils/hiddenPaths'

defineMessages({
  miniShelf: {
    id: 'admin/editor.recommendation-mini-shelf',
    defaultMessage: 'Recommendation MiniShelf',
  },
  miniShelfDescription: {
    id: 'admin/editor.recommendation-mini-shelf.description',
    defaultMessage:
      'Compact, collapsible recommendation shelf designed for small spaces such as the Mini-Cart.',
  },
})

type Props = {
  campaignVrn: string
  title?: string
  displayTitle: boolean
  itemsContext: ItemContextType[]
  hiddenPaths?: string[]
  displayLoading?: boolean
  loadingItemsPerPage?: LoadingItemsPerPage
  children?: ReactNode
}

const RecommendationMiniShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
  displayTitle,
  itemsContext,
  hiddenPaths,
  displayLoading,
  loadingItemsPerPage,
  children,
}) => {
  const { route } = useRuntime()

  if (!campaignVrn) return null

  const currentPath = route?.canonicalPath ?? route?.path ?? '/'

  if (isPathHidden(currentPath, hiddenPaths)) return null

  return (
    <RecommendationShelfErrorBoundary>
      <RecommendationShelfContainer
        variant="mini"
        campaignVrn={campaignVrn}
        title={title}
        displayTitle={displayTitle}
        itemsContext={itemsContext}
        displayLoading={displayLoading}
        loadingItemsPerPage={loadingItemsPerPage}
      >
        {children}
      </RecommendationShelfContainer>
    </RecommendationShelfErrorBoundary>
  )
}

const shelfSchema = RecommendationShelf.schema as {
  properties: Record<string, any>
}

RecommendationMiniShelf.schema = {
  title: 'admin/editor.recommendation-mini-shelf',
  description: 'admin/editor.recommendation-mini-shelf.description',
  type: 'object',
  properties: {
    ...shelfSchema.properties,
    loadingItemsPerPage: {
      ...shelfSchema.properties.loadingItemsPerPage,
      properties: {
        desktop: {
          ...shelfSchema.properties.loadingItemsPerPage.properties.desktop,
          default: 2,
        },
        tablet: {
          ...shelfSchema.properties.loadingItemsPerPage.properties.tablet,
          default: 2,
        },
        phone: {
          ...shelfSchema.properties.loadingItemsPerPage.properties.phone,
          default: 1,
        },
      },
    },
  },
}

export default RecommendationMiniShelf

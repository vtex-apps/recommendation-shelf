import React from 'react'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { RecommendationShelfErrorBoundary } from './components/RecommendationShelfErrorBoundary'
import { RecommendationShelfContainer } from './components/RecommendationShelfContainer'
import { isPathHidden } from './utils/hiddenPaths'

defineMessages({
  shelf: {
    id: 'admin/editor.recommendation-shelf',
    defaultMessage: 'Recommendation Shelf',
  },
  description: {
    id: 'admin/editor.recommendation-shelf.description',
    defaultMessage:
      'Recommendation Shelf is a component that displays a collection of items recommended to the user based on different algorithms and contextual data.',
  },
  title: {
    id: 'admin/editor.recommendation-shelf.title',
    defaultMessage: 'Shelf title',
  },
  campaignVrn: {
    id: 'admin/editor.recommendation-shelf.campaign-vrn',
    defaultMessage: 'Campaign VRN',
  },
  displayTitle: {
    id: 'admin/editor.recommendation-shelf.display-title',
    defaultMessage: 'Display Title',
  },
  itemsContext: {
    id: 'admin/editor.recommendation-shelf.items-context',
    defaultMessage: 'Item context',
  },
  itemsContextDescription: {
    id: 'admin/editor.recommendation-shelf.items-context.description',
    defaultMessage:
      'The source from which items are retrieved for use as context in the recommendation request',
  },
  itemsContextCart: {
    id: 'admin/editor.recommendation-shelf.items-context.cart',
    defaultMessage: 'Cart',
  },
  itemsContextPdp: {
    id: 'admin/editor.recommendation-shelf.items-context.pdp',
    defaultMessage: 'Product page',
  },
  hiddenPaths: {
    id: 'admin/editor.recommendation-shelf.hidden-paths',
    defaultMessage: 'Hidden paths',
  },
  hiddenPathsDescription: {
    id: 'admin/editor.recommendation-shelf.hidden-paths.description',
    defaultMessage:
      "URL paths where the shelf shouldn't be displayed. Use exact paths (example: /checkout/cart) or prefix wildcards with * (example: /produto/*).",
  },
  displayLoading: {
    id: 'admin/editor.recommendation-shelf.display-loading',
    defaultMessage: 'Display loading placeholder',
  },
  displayLoadingDescription: {
    id: 'admin/editor.recommendation-shelf.display-loading.description',
    defaultMessage: 'Shows a loading placeholder while the shelf loads',
  },
  loadingItemsPerPage: {
    id: 'admin/editor.recommendation-shelf.loading-items-per-page',
    defaultMessage: 'Loading items per page',
  },
  loadingItemsPerPageDescription: {
    id: 'admin/editor.recommendation-shelf.loading-items-per-page.description',
    defaultMessage:
      'Number of loading placeholders to display per device type while the shelf loads',
  },
  loadingItemsPerPageDesktop: {
    id: 'admin/editor.recommendation-shelf.loading-items-per-page.desktop',
    defaultMessage: 'Desktop',
  },
  loadingItemsPerPageTablet: {
    id: 'admin/editor.recommendation-shelf.loading-items-per-page.tablet',
    defaultMessage: 'Tablet',
  },
  loadingItemsPerPagePhone: {
    id: 'admin/editor.recommendation-shelf.loading-items-per-page.phone',
    defaultMessage: 'Phone',
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
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
  displayTitle,
  itemsContext,
  hiddenPaths,
  displayLoading,
  loadingItemsPerPage,
}) => {
  const { route } = useRuntime()

  if (!campaignVrn) return null

  const currentPath = route?.canonicalPath ?? route?.path ?? '/'

  if (isPathHidden(currentPath, hiddenPaths)) return null

  return (
    <RecommendationShelfErrorBoundary>
      <RecommendationShelfContainer
        campaignVrn={campaignVrn}
        title={title}
        displayTitle={displayTitle}
        itemsContext={itemsContext}
        displayLoading={displayLoading}
        loadingItemsPerPage={loadingItemsPerPage}
      />
    </RecommendationShelfErrorBoundary>
  )
}

RecommendationShelf.schema = {
  title: 'admin/editor.recommendation-shelf',
  description: 'admin/recommendation-shelf.description',
  type: 'object',
  properties: {
    title: {
      title: 'admin/editor.recommendation-shelf.title',
      type: 'string',
    },
    campaignVrn: {
      title: 'admin/editor.recommendation-shelf.campaign-vrn',
      type: 'string',
    },
    displayTitle: {
      title: 'admin/editor.recommendation-shelf.display-title',
      type: 'boolean',
      default: true,
    },
    itemsContext: {
      title: 'admin/editor.recommendation-shelf.items-context',
      description:
        'admin/editor.recommendation-shelf.items-context.description',
      type: 'array',
      items: {
        type: 'string',
        enum: ['PDP', 'CART'],
        enumNames: [
          'admin/editor.recommendation-shelf.items-context.pdp',
          'admin/editor.recommendation-shelf.items-context.cart',
        ],
      },
      default: ['PDP'],
    },
    hiddenPaths: {
      title: 'admin/editor.recommendation-shelf.hidden-paths',
      description: 'admin/editor.recommendation-shelf.hidden-paths.description',
      type: 'array',
      items: {
        type: 'string',
      },
      default: [],
    },
    displayLoading: {
      title: 'admin/editor.recommendation-shelf.display-loading',
      description:
        'admin/editor.recommendation-shelf.display-loading.description',
      type: 'boolean',
      default: true,
    },
    loadingItemsPerPage: {
      title: 'admin/editor.recommendation-shelf.loading-items-per-page',
      description:
        'admin/editor.recommendation-shelf.loading-items-per-page.description',
      type: 'object',
      properties: {
        desktop: {
          title:
            'admin/editor.recommendation-shelf.loading-items-per-page.desktop',
          type: 'number',
          default: 5,
        },
        tablet: {
          title:
            'admin/editor.recommendation-shelf.loading-items-per-page.tablet',
          type: 'number',
          default: 3,
        },
        phone: {
          title:
            'admin/editor.recommendation-shelf.loading-items-per-page.phone',
          type: 'number',
          default: 2,
        },
      },
    },
  },
}

export default RecommendationShelf

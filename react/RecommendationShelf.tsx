import React from 'react'
import { defineMessages } from 'react-intl'

import { RecommendationShelfErrorBoundary } from './components/RecommendationShelfErrorBoundary'
import { RecommendationShelfContainer } from './components/RecommendationShelfContainer'

defineMessages({
  shelf: {
    id: 'admin/editor.recommendation-shelf',
    defaultMessage: 'Recommendation Shelf',
  },
  description: {
    id: 'admin/editor.recommendation-shelf.description',
    defaultMessage:
      'Recommendation Shelf is a component that displays a collection of items that are recommended to the user based on various algorithms and context data.',
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
    defaultMessage: 'Items Context',
  },
  itemsContextDescription: {
    id: 'admin/editor.recommendation-shelf.items-context.description',
    defaultMessage: 'Items Context',
  },
  itemsContextCart: {
    id: 'admin/editor.recommendation-shelf.items-context.cart',
    defaultMessage: 'Items Context',
  },
  itemsContextPdp: {
    id: 'admin/editor.recommendation-shelf.items-context.pdp',
    defaultMessage: 'Items Context',
  },
})

type Props = {
  campaignVrn?: string
  title?: string
  recommendationType?: RecommendationType // Deprecated, use campaignVrn instead
  displayTitle: boolean
  itemsContext: Array<'PDP' | 'CART'>
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
  recommendationType,
  displayTitle,
}) => {
  return (
    <RecommendationShelfErrorBoundary>
      <RecommendationShelfContainer
        campaignVrn={campaignVrn}
        title={title}
        recommendationType={recommendationType}
        displayTitle={displayTitle}
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
  },
}

export default RecommendationShelf

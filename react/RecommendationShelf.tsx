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
})

type Props = {
  campaignVrn?: string
  title?: string
  recommendationType?: RecommendationType // Deprecated, use campaignVrn instead
  displayTitle: boolean
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
  },
}

export default RecommendationShelf

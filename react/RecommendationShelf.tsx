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
  recommendationType: {
    id: 'admin/editor.recommendation-shelf.recommendation-type',
    defaultMessage: 'Recommendation type',
  },
  topItems: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.top-items',
    defaultMessage: 'Top Items',
  },
  similar: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.similar-items',
    defaultMessage: 'Similar Items',
  },
  cross: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.cross-sell',
    defaultMessage: 'Cross-sell',
  },
  last: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.last-seen',
    defaultMessage: 'Last Seen',
  },
  personalized: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.personalized',
    defaultMessage: 'Personalized',
  },
  visualSimilarity: {
    id: 'admin/editor.recommendation-shelf.recommendation-type.visual-similarity',
    defaultMessage: 'Visual Similarity',
  },
})

type Props = {
  campaignVrn?: string
  title?: string
  recommendationType: RecommendationType
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
  recommendationType,
}) => {
  return (
    <RecommendationShelfErrorBoundary>
      <RecommendationShelfContainer
        campaignVrn={campaignVrn}
        title={title}
        recommendationType={recommendationType}
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
    recommendationType: {
      title: 'admin/editor.recommendation-shelf.recommendation-type',
      type: 'string',
      enum: [
        'CROSS_SELL',
        'SIMILAR_ITEMS',
        'PERSONALIZED',
        'TOP_ITEMS',
        'LAST_SEEN',
        'VISUAL_SIMILARITY',
      ],
      default: 'TOP_ITEMS',
      enumNames: [
        'admin/editor.recommendation-shelf.recommendation-type.cross-sell',
        'admin/editor.recommendation-shelf.recommendation-type.similar-items',
        'admin/editor.recommendation-shelf.recommendation-type.personalized',
        'admin/editor.recommendation-shelf.recommendation-type.top-items',
        'admin/editor.recommendation-shelf.recommendation-type.last-seen',
        'admin/editor.recommendation-shelf.recommendation-type.visual-similarity',
      ],
    },
  },
}

export default RecommendationShelf

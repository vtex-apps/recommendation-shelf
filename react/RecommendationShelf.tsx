import React from 'react'
import { defineMessages } from 'react-intl'

import { RecommendationShelfErrorBoundary } from './errors/RecommendationShelfErrorBoundary'
import { RecommendationShelfContainer } from './components/RecommendationShelfContainer'

defineMessages({
  title: {
    id: 'admin/recommendation-shelf.title',
    defaultMessage: 'Recommendation Shelf',
  },
})

type Props = {
  campaignVrn?: string
  title?: string
}

const RecommendationShelf: StorefrontFunctionComponent<Props> = ({
  campaignVrn,
  title,
}) => {
  return (
    <RecommendationShelfErrorBoundary>
      <RecommendationShelfContainer campaignVrn={campaignVrn} title={title} />
    </RecommendationShelfErrorBoundary>
  )
}

RecommendationShelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default RecommendationShelf

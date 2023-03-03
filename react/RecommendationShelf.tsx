import React, { Fragment } from 'react'

interface Props {
  strategy: string
  secondaryStrategy?: string
  recommendation: RecommendationOptions
}

const Shelf: StorefrontFunctionComponent<Props> = () => {
  console.warn(`"RecommendationShelf" is deprecated, please do not use it.`)

  return <Fragment />
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

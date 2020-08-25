import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  strategy?: string
  secondaryStrategy?: string
  recommendation?: RecommendationOptions
}

const Shelf: StorefrontFunctionComponent<Props> = ({
  strategy,
  secondaryStrategy,
  recommendation,
}) => {
  // eslint-disable-next-line no-console
  console.log(strategy, secondaryStrategy, recommendation)
  return <ExtensionPoint id="default-shelf" />
}

Shelf.schema = {
  title: 'admin/recommendation-shelf.title',
}

export default Shelf

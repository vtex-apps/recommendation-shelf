import './style.css'

import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'recommendationSkeletonPiece',
  'recommendationSkeletonPieceShimmer',
]

export function SkeletonPiece() {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.recommendationSkeletonPiece} bg-muted-4 br3 center`}
    >
      <div className={`${handles.recommendationSkeletonPieceShimmer}`} />
    </div>
  )
}

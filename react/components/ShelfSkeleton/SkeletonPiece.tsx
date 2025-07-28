import './style.css'

import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['recommendationSkeletonPiece']

export function SkeletonPiece() {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.recommendationSkeletonPiece} bg-muted-5 br3 center`}
    >
      <div className="shimmer" />
    </div>
  )
}

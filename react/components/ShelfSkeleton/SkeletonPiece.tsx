import './style.css'

import React from 'react'

export function SkeletonPiece() {
  return (
    <div
      className="bg-muted-5 br3 center"
      style={{ height: '550px', width: '300px' }}
    >
      <div className="shimmer" />
    </div>
  )
}

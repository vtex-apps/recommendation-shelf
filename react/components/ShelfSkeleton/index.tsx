import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { SkeletonPiece } from './SkeletonPiece'

const CSS_HANDLES = ['recommendationShelfContainer']

function checkDevice(): 'DESKTOP' | 'MOBILE' | 'TABLET' {
  if (typeof window === 'undefined') {
    return 'DESKTOP'
  }

  if (window.innerWidth <= 768) {
    return 'MOBILE'
  }

  if (window.innerWidth <= 1024) {
    return 'TABLET'
  }

  return 'DESKTOP'
}

const DEVICE_MAP = {
  DESKTOP: 4,
  MOBILE: 1,
  TABLET: 3,
}

export function ShelfSkeleton() {
  const handles = useCssHandles(CSS_HANDLES)
  const device = checkDevice()
  const skeletonCount = DEVICE_MAP[device] || DEVICE_MAP.DESKTOP
  const skeletonPieces = Array.from({ length: skeletonCount }, (_, index) => (
    <SkeletonPiece key={index} />
  ))

  return (
    <div
      className={`${handles.recommendationShelfContainer} w-100 flex justify-center`}
    >
      {skeletonPieces}
    </div>
  )
}

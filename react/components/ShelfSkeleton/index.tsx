import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { SkeletonPiece } from './SkeletonPiece'

const CSS_HANDLES = ['recommendationShelfContainer']

// Number of skeleton tiles per device type. The device is resolved by
// render-runtime from the User-Agent on the server, so it is consistent
// across SSR and client hydration (unlike window.innerWidth).
const DEVICE_MAP = {
  phone: 2,
  tablet: 3,
  desktop: 5,
} as const

export function ShelfSkeleton() {
  const handles = useCssHandles(CSS_HANDLES)
  const { deviceInfo } = useRuntime()

  const skeletonCount =
    DEVICE_MAP[deviceInfo?.type as keyof typeof DEVICE_MAP] ??
    DEVICE_MAP.desktop

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

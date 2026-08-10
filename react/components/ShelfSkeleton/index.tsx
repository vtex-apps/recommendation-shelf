import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { SkeletonPiece } from './SkeletonPiece'

const CSS_HANDLES = [
  'recommendationShelfContainer',
  'recommendationShelfContainerLoading',
]

// Default number of skeleton tiles per device type. The device is resolved by
// render-runtime from the User-Agent on the server, so it is consistent
// across SSR and client hydration (unlike window.innerWidth).
const DEFAULT_ITEMS_PER_PAGE: Required<LoadingItemsPerPage> = {
  phone: 2,
  tablet: 3,
  desktop: 5,
}

type Props = {
  itemsPerPage?: LoadingItemsPerPage
}

export function ShelfSkeleton({ itemsPerPage }: Props) {
  const handles = useCssHandles(CSS_HANDLES)
  const { deviceInfo } = useRuntime()

  const deviceType =
    (deviceInfo?.type as keyof LoadingItemsPerPage) ?? 'desktop'

  const skeletonCount =
    itemsPerPage?.[deviceType] ??
    DEFAULT_ITEMS_PER_PAGE[deviceType] ??
    DEFAULT_ITEMS_PER_PAGE.desktop

  const skeletonPieces = Array.from(
    { length: Math.max(0, skeletonCount) },
    (_, index) => <SkeletonPiece key={index} />
  )

  return (
    <div
      className={`${handles.recommendationShelfContainer} ${handles.recommendationShelfContainerLoading} w-100 flex justify-center`}
    >
      {skeletonPieces}
    </div>
  )
}

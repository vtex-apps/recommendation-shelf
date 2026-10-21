import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import styles from './style.css'

const CSS_HANDLES = [
  'miniShelfContainer',
  'miniShelfContainerLoading',
  'miniShelfSkeletonPiece',
  'miniShelfSkeletonTitle',
  'miniShelfSkeletonTitlePiece',
]

const DEFAULT_ITEMS_PER_PAGE: Required<LoadingItemsPerPage> = {
  phone: 1,
  tablet: 2,
  desktop: 2,
}

type Props = {
  itemsPerPage?: LoadingItemsPerPage
}

export function MiniShelfSkeleton({ itemsPerPage }: Props) {
  const handles = useCssHandles(CSS_HANDLES)
  const { deviceInfo } = useRuntime()

  const deviceType =
    (deviceInfo?.type as keyof LoadingItemsPerPage) ?? 'desktop'

  const count =
    itemsPerPage?.[deviceType] ??
    DEFAULT_ITEMS_PER_PAGE[deviceType] ??
    DEFAULT_ITEMS_PER_PAGE.desktop

  return (
    <div
      className={`${handles.miniShelfContainer} ${handles.miniShelfContainerLoading} w-100`}
    >
      <div className={`${styles.title} ${handles.miniShelfSkeletonTitle}`}>
        <div
          className={`${styles.titlePiece} ${handles.miniShelfSkeletonTitlePiece} bg-muted-4 br3`}
        />
      </div>
      <div className={`${styles.container} flex`}>
        {Array.from({ length: Math.max(0, count) }, (_, index) => (
          <div
            key={index}
            className={`${styles.piece} ${handles.miniShelfSkeletonPiece} bg-muted-4 br3`}
          />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

// Control group handling.
//
// Activity Flow writes `localStorage["vtex-rec-control-group"]` after
// start-session returns. The shelf only reads that key. `control` stays
// hidden. `base` renders. A missing key stays hidden and is read again
// every second, up to 5 times.

export const CONTROL_GROUP_BODY_ATTRIBUTE = 'data-vtex-rec-control-group'
export const CONTROL_GROUP_STORAGE_KEY = 'vtex-rec-control-group'
const CONTROL_GROUP_POLL_INTERVAL_MS = 1000
const CONTROL_GROUP_MAX_RETRIES = 5

// Variant value that identifies the control group. Change here if the external
// script starts using a different value.
export const CONTROL_GROUP_VARIANT = 'control'
const BASE_GROUP_VARIANT = 'base'

export type ShelfVisibility = 'pending' | 'show' | 'hide'

/** `pending` means the script has not assigned a group yet. */
export function shelfVisibility(): ShelfVisibility {
  const variant = getAssignedVariant()

  if (variant === CONTROL_GROUP_VARIANT) return 'hide'
  if (variant === BASE_GROUP_VARIANT) return 'show'

  return 'pending'
}

/**
 * Reads the variant Activity Flow stored for this browser.
 *
 * Returns null during server-side rendering, or when the key is missing
 * or holds something other than `base` or `control`.
 */
export function getAssignedVariant(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage?.getItem(CONTROL_GROUP_STORAGE_KEY)

    return stored === CONTROL_GROUP_VARIANT || stored === BASE_GROUP_VARIANT
      ? stored
      : null
  } catch {
    return null
  }
}

/**
 * Whether the current session belongs to the control group and therefore the
 * shelf must be fully hidden, including its loading state.
 */
export function isControlGroup(): boolean {
  return getAssignedVariant() === CONTROL_GROUP_VARIANT
}

/**
 * Reports when the shelf should be shown or kept hidden.
 *
 * localStorage is polled because a same-tab write does not emit an event.
 * Five misses leave the shelf hidden. There is no timeout that shows it.
 */
export function watchShelfVisibility(
  onChange: (visibility: Exclude<ShelfVisibility, 'pending'>) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  let close: () => void = () => undefined
  let announced: ShelfVisibility = 'pending'
  let retries = 0
  const publish = (next: Exclude<ShelfVisibility, 'pending'>) => {
    if (announced === next) return
    announced = next
    onChange(next)
    close()
  }

  const check = () => {
    const visibility = shelfVisibility()

    if (visibility === 'pending') return
    publish(visibility)
  }

  const intervalId = window.setInterval(() => {
    retries += 1
    check()
    if (retries >= CONTROL_GROUP_MAX_RETRIES) close()
  }, CONTROL_GROUP_POLL_INTERVAL_MS)

  let closed = false

  close = () => {
    if (closed) return
    closed = true
    window.clearInterval(intervalId)
  }

  check()

  return close
}

/** Hides the shelf while the group is unknown or `control`. */
export function useShelfVisibility(): ShelfVisibility {
  const [visibility, setVisibility] = useState(shelfVisibility)

  useEffect(() => watchShelfVisibility(setVisibility), [])

  return visibility
}

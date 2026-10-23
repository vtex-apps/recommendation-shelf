import { useEffect, useState } from 'react'

// Control group handling.
//
// An external script splits traffic and tags the current session by setting a
// `data-vtex-rec-control-group` attribute on <body> (and mirroring it in
// localStorage under `vtex-rec-control-group`) to either `base` or `control`.
// The script can run after the shelf's first render. Until the group is
// known, the shelf stays hidden. `control` keeps it hidden. `base` shows it.
// If no group arrives, the shelf is shown so pages without the script still
// render.

export const CONTROL_GROUP_BODY_ATTRIBUTE = 'data-vtex-rec-control-group'
export const CONTROL_GROUP_STORAGE_KEY = 'vtex-rec-control-group'
const CONTROL_GROUP_POLL_INTERVAL_MS = 100
const CONTROL_GROUP_POLL_TIMEOUT_MS = 5000

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
 * Reads the variant assigned to the current session.
 *
 * Prefers the <body> attribute (set synchronously by the external script
 * before hydration) and falls back to localStorage. Returns null when it
 * cannot be resolved (e.g. server-side rendering).
 */
export function getAssignedVariant(): string | null {
  if (typeof document === 'undefined') return null

  const bodyVariant = document.body?.getAttribute(CONTROL_GROUP_BODY_ATTRIBUTE)

  if (bodyVariant) return bodyVariant

  try {
    return window.localStorage?.getItem(CONTROL_GROUP_STORAGE_KEY) ?? null
  } catch {
    // localStorage may be unavailable (e.g. privacy mode); ignore.
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
 * The body attribute is observed until a group is assigned. localStorage is
 * polled for a few seconds because a same-tab write does not emit an event.
 * When that wait ends with no group, the shelf is shown.
 */
export function watchShelfVisibility(
  onChange: (visibility: Exclude<ShelfVisibility, 'pending'>) => void
): () => void {
  if (typeof document === 'undefined' || !document.body) {
    return () => undefined
  }

  let close = () => undefined
  let announced: ShelfVisibility = 'pending'
  const publish = (next: Exclude<ShelfVisibility, 'pending'>) => {
    if (announced === next) return
    announced = next
    onChange(next)
    if (next === 'hide') close()
  }

  const check = () => {
    const visibility = shelfVisibility()

    if (visibility === 'pending') return
    publish(visibility)
  }

  const observer = new MutationObserver(check)

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [CONTROL_GROUP_BODY_ATTRIBUTE],
  })
  const intervalId = window.setInterval(check, CONTROL_GROUP_POLL_INTERVAL_MS)
  const timeoutId = window.setTimeout(() => {
    window.clearInterval(intervalId)
    if (shelfVisibility() === 'pending') publish('show')
  }, CONTROL_GROUP_POLL_TIMEOUT_MS)

  let closed = false

  close = () => {
    if (closed) return
    closed = true
    observer.disconnect()
    window.clearInterval(intervalId)
    window.clearTimeout(timeoutId)
  }

  check()

  return close
}

/** Hides the shelf while the group is unknown or `control`. */
export function useShelfVisibility(): ShelfVisibility {
  const [visibility, setVisibility] = useState(shelfVisibility)

  useEffect(() => {
    if (shelfVisibility() !== 'pending') return undefined

    return watchShelfVisibility(setVisibility)
  }, [])

  return visibility
}

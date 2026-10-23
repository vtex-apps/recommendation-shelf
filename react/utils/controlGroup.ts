import { useEffect, useState } from 'react'

// Control group handling.
//
// An external script splits traffic and tags the current session by setting a
// `data-vtex-rec-control-group` attribute on <body> (and mirroring it in
// localStorage under `vtex-rec-control-group`) to either `base` or `control`.
// The script can run after the shelf's first render, so the shelf watches both
// places until `control` is assigned. Sessions assigned to the control group
// must not see the shelf at all (not even its loading placeholder), while
// every other session renders normally.

export const CONTROL_GROUP_BODY_ATTRIBUTE = 'data-vtex-rec-control-group'
export const CONTROL_GROUP_STORAGE_KEY = 'vtex-rec-control-group'
const CONTROL_GROUP_POLL_INTERVAL_MS = 100
const CONTROL_GROUP_POLL_TIMEOUT_MS = 5000

// Variant value that identifies the control group. Change here if the external
// script starts using a different value.
export const CONTROL_GROUP_VARIANT = 'control'

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
 * Calls `onControl` when the page is already `control`, or becomes `control`
 * after this subscription starts. The body attribute is observed for the
 * lifetime of the subscription. localStorage is polled briefly because a
 * same-tab write does not emit an event.
 */
export function watchControlGroup(onControl: () => void): () => void {
  if (typeof document === 'undefined' || !document.body) {
    return () => undefined
  }

  let close = () => undefined
  const check = () => {
    if (!isControlGroup()) return
    onControl()
    close()
  }

  const observer = new MutationObserver(check)

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [CONTROL_GROUP_BODY_ATTRIBUTE],
  })
  const intervalId = window.setInterval(check, CONTROL_GROUP_POLL_INTERVAL_MS)
  const timeoutId = window.setTimeout(() => {
    window.clearInterval(intervalId)
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

/** True when the shopper is in the control group, including a late assignment. */
export function useIsControlGroup(): boolean {
  const [isControl, setIsControl] = useState(isControlGroup)

  useEffect(() => {
    if (isControl) return undefined

    return watchControlGroup(() => setIsControl(true))
  }, [isControl])

  return isControl
}

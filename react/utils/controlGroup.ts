// Control group handling.
//
// An external script splits traffic and tags the current session by setting a
// `data-vtex-rec-control-group` attribute on <body> (and mirroring it in
// localStorage under `vtex-rec-control-group`) to either `base` or `control`.
// Sessions assigned to the control group must not see the shelf at all (not
// even its loading placeholder), while every other session renders normally.

export const CONTROL_GROUP_BODY_ATTRIBUTE = 'data-vtex-rec-control-group'
export const CONTROL_GROUP_STORAGE_KEY = 'vtex-rec-control-group'

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

/* eslint-disable padding-line-between-statements */

/**
 * IMPORTANT
 *
 * The following logic was extracted from "https://github.com/vtex/analytics-activity-flow-script/blob/4694e60b36ef15f852a16d87abb5270dc62f71c3/scripts/web/src/ads/utils/attachViewEvent.ts"
 * We just copied the code here since we don't have a straight forward way to re-use it in both places. In the future this will be removed when we consolidate all the analytics logic to be done via activity-flow.
 *
 */

/**
 * Possible view status of an element.
 */
type ViewStatus = 'NOT_VIEWED' | 'IN_VIEW' | 'VIEWED'

/**
 * A map of unique elements that have been tracked either in or views.
 */
type TrackedViewStatus = Record<string, ViewStatus>

/**
 * A map of the timeout functions by unique ID. It's done to prevent
 * multiple timeout running at once.
 */
type TimeoutFunctions = Record<string, NodeJS.Timeout>

/**
 * Arguments passed to the onIntersectionChange function.
 */
type OnIntersectionChangeArgs = {
  entry: IntersectionObserverEntry
  id: string
  element: Element
  observer: IntersectionObserver
}

/**
 * The minimum time an ad must be visible to be considered viewed.
 * This is the IAB standard.
 */
export const MINIMUM_VIEW_TIME = 1000 // 1 second

let trackedViewStatus: TrackedViewStatus = {}
let timeoutFunctions: TimeoutFunctions = {}

/**
 * Clear the tracked elements view statuses.
 */
export function clearTrackedViews() {
  trackedViewStatus = {}
  timeoutFunctions = {}
}

/**
 * Attach a custom "view" event to an element. The event will be dispatched
 * when the element is at least 50% visible for at least 1 second. It will
 * only be dispatched once.
 * @param element The HTML element to be tracked.
 * @param id A unique ID for the element
 */
export function attachViewEvent(element: Element, id: string) {
  if (getViewStatus(id) === 'VIEWED') return

  const options = { threshold: 0.5, rootMargin: '0px' }

  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) =>
      onIntersectionChange({ id, observer, element, entry })
    )
  }, options)

  observer.observe(element)
}

/**
 * Called everytime the element appaers or disappears from the viewport.
 */
function onIntersectionChange({
  id,
  element,
  observer,
  entry,
}: OnIntersectionChangeArgs) {
  const viewStatus = getViewStatus(id)

  // eslint-disable-next-line default-case
  switch (viewStatus) {
    case 'NOT_VIEWED':
      if (!entry.isIntersecting) break

      setViewStatus(id, 'IN_VIEW')

      waitAndCallbackIfElementIsInView(id, () => {
        setViewStatus(id, 'VIEWED')
        observer.disconnect()

        dispatchViewEvent(element)
      })

      break
    case 'IN_VIEW':
      if (!entry.isIntersecting) setViewStatus(id, 'NOT_VIEWED')

      break
    case 'VIEWED':
      observer.disconnect()
      break
  }
}

/**
 * Call a callback if the element is still in view after the minimum view time.
 */
function waitAndCallbackIfElementIsInView(id: string, callback: () => void) {
  clearTimeoutFunction(id)

  const timeout = setTimeout(() => {
    if (getViewStatus(id) !== 'IN_VIEW') return

    callback()
  }, MINIMUM_VIEW_TIME)

  setTimeoutFunction(id, timeout)
}

/**
 * Dispatch a custom JS view event on the element.
 */
function dispatchViewEvent(element: Element) {
  element.dispatchEvent(new Event('view'))
}

/**
 * Set the view status of an element.
 */
function setViewStatus(id: string, status: ViewStatus) {
  trackedViewStatus[id] = status
}

/**
 * Get the view status of an element.
 */
function getViewStatus(id: string) {
  return trackedViewStatus[id] ?? 'NOT_VIEWED'
}

/**
 * Clear a timeout function if it exists to prevent multiple timeouts.
 */
function clearTimeoutFunction(id: string) {
  const timeout = timeoutFunctions[id]

  if (timeout) clearTimeout(timeout)
}

/**
 * Store the timeout function by ID.
 */
function setTimeoutFunction(id: string, timeout: NodeJS.Timeout) {
  timeoutFunctions[id] = timeout
}

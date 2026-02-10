import type {
  StartSessionRequestBody,
  StartSessionResponse,
} from 'recommend-bff'

import { getWithRetry } from './getWithRetry'
import { generateRecOriginHeader } from './requests'
import { logger } from './logger'

export function getCookie(name: string): string | null {
  const regex = new RegExp(`(^|;)[ ]*${name}=([^;]*)`)
  const match = regex.exec(document.cookie)

  return match ? decodeURIComponent(match[2]) : null
}

async function getCookieExpiration(name: string): Promise<string | null> {
  // Try to use Cookie Store API if available (modern browsers)
  if ('cookieStore' in window) {
    try {
      const { cookieStore } = window as Window & {
        cookieStore?: {
          get: (name: string) => Promise<{
            expires?: Date | number
            [key: string]: unknown
          } | null>
        }
      }

      if (cookieStore) {
        const cookie = (await cookieStore.get(name)) as {
          expires?: Date | number
        } | null

        if (cookie?.expires) {
          // Cookie Store API returns expiration as a Date object or timestamp
          if (cookie.expires instanceof Date) {
            return cookie.expires.toUTCString()
          }

          if (typeof cookie.expires === 'number') {
            return new Date(cookie.expires).toUTCString()
          }
        }
      }
    } catch {
      // Cookie Store API not available or failed, fall through to fallback
    }
  }

  // Fallback: document.cookie doesn't include expiration info,
  // so we return null and will use a default expiration
  return null
}

function setCookie(
  name: string,
  value: string,
  expirationDate?: string | Date
): void {
  let expires = ''

  if (expirationDate) {
    if (typeof expirationDate === 'string') {
      expires = `expires=${expirationDate};`
    } else {
      expires = `expires=${expirationDate.toUTCString()};`
    }
  } else {
    // Default to 1 days if no expiration provided
    const date = new Date()

    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000)
    expires = `expires=${date.toUTCString()};`
  }

  document.cookie = `${name}=${encodeURIComponent(value)};${expires}path=/`
}

export function getUserIdFromCookie(): string {
  const recommendationUser = getCookie('vtex-rec-user-id')
  const syneryUser = getCookie('_snrs_uuid')

  return recommendationUser ?? syneryUser ?? ''
}

type CookieState = {
  snrsUuid: string | null
  vtexRecUserId: string | null
  vtexRCMacId: string | null
}

/**
 * Ensures that userId cookies (_snrs_uuid or vtex-rec-user-id) exist.
 * If they don't exist, creates them using the value from VtexRCMacIdv7 cookie.
 * This function should be called whenever a RecommendationShelf is rendered.
 */
export async function ensureUserIdCookies(): Promise<void> {
  if (typeof document === 'undefined') {
    return
  }

  // Check all cookies with retry to ensure we have the latest state

  let cookieState: CookieState

  try {
    cookieState = await getWithRetry<CookieState>(
      () => {
        const snrsUuid = getCookie('_snrs_uuid')
        const vtexRecUserId = getCookie('vtex-rec-user-id')
        const vtexRCMacId = getCookie('VtexRCMacIdv7')

        // Return state if we have userId cookies OR if we have VtexRCMacIdv7
        // This ensures we proceed if either condition is met
        if (snrsUuid || vtexRecUserId || vtexRCMacId) {
          return {
            snrsUuid,
            vtexRecUserId,
            vtexRCMacId,
          }
        }

        // Throw to trigger retry if nothing is available
        throw new Error('No cookies available')
      },
      15,
      200
    )
  } catch (error) {
    return
  }

  // If userId cookies already exist, do nothing
  if (cookieState.snrsUuid || cookieState.vtexRecUserId) {
    return
  }

  // If VtexRCMacIdv7 doesn't exist, do nothing
  if (!cookieState.vtexRCMacId) {
    return
  }

  // Get the expiration from VtexRCMacIdv7 cookie
  const expiration = await getCookieExpiration('VtexRCMacIdv7')

  // Create both cookies with the value and expiration from VtexRCMacIdv7
  setCookie('_snrs_uuid', cookieState.vtexRCMacId, expiration ?? undefined)
  setCookie(
    'vtex-rec-user-id',
    cookieState.vtexRCMacId,
    expiration ?? undefined
  )
}

export async function startSession({
  account,
  userId,
}: {
  account: string
  userId?: string
}): Promise<StartSessionResponse | null> {
  if (typeof document === 'undefined') {
    return null
  }

  try {
    const body: StartSessionRequestBody = { userId }

    const response = await fetch(
      `/api/recommend-bff/v2/users/start-session?an=${account}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...generateRecOriginHeader(account),
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: StartSessionResponse = await response.json()

    return result
  } catch (error) {
    logger.error({
      message: 'Error starting session',
      data: { error, account, userId },
      sendLog: true,
    })

    return null
  }
}

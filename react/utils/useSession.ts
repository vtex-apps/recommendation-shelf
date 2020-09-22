import { useSSR } from 'vtex.render-runtime'
import { getCookie } from './dom-utils'

export const useSession = (account: string) => {
  const isSSR = useSSR()
  if (isSSR) {
    return {}
  }

  const storeId = getCookie('rcs_storeId.s' + account)
  if (!storeId) {
    return {}
  }

  const sessionId = getCookie('rcs_session.s' + storeId)
  if (!sessionId) {
    return {}
  }

  return { sessionId }
}

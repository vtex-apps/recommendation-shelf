import { useSSR } from 'vtex.render-runtime'
import { getCookie } from './dom-utils'

export const useAnonymous = (account: string) => {
  const isSSR = useSSR()
  if (isSSR) {
    return {}
  }

  const storeId = getCookie('rcs_storeId.s' + account)
  if (!storeId) {
    return {}
  }

  const anonymous = getCookie('rcs_anonymousUserId.s' + storeId)
  if (!anonymous) {
    return {}
  }

  return { anonymous }
}

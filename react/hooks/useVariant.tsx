import { useCallback, useEffect, useState } from 'react'
import { canUseDOM } from 'vtex.render-runtime'

import { getCookie } from '../utils/dom-utils'

const useVariant = () => {
  const [variant, setVariant] = useState<string | null>()

  const tryToSetVariant = useCallback((retries: number) => {
    if (!canUseDOM) {
      return
    }

    const cookieVariant = getCookie('sp-variant')

    if (!cookieVariant && retries > 0) {
      setTimeout(() => tryToSetVariant(retries - 1), 200)

      return
    }

    setVariant(cookieVariant)
  }, [])

  useEffect(() => {
    tryToSetVariant(3)
  }, [tryToSetVariant])

  return { variant }
}

export default useVariant

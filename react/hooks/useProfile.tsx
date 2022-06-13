import { useEffect, useState } from 'react'

interface KeyValue {
  value: string
}

interface Profile {
  id: KeyValue
  isAuthenticated: KeyValue
  email: string
}

interface Session {
  id: string
  type: undefined
  namespaces: {
    store: {
      channel: string
    }
    profile: Profile
  }
}

interface SessionUnauthorized {
  type: 'Unauthorized'
  message: string
}

interface SessionForbidden {
  type: 'Forbidden'
  message: string
}

export type SessionResponse = Session | SessionUnauthorized | SessionForbidden

export interface SessionPromise {
  response: SessionResponse
}

const instanceOfSession = (object: any): object is Session =>
  'namespaces' in object

function getSessionFromWindow() {
  return window &&
    (window as any).__RENDER_8_SESSION__ &&
    (window as any).__RENDER_8_SESSION__.sessionPromise
    ? (window as any).__RENDER_8_SESSION__.sessionPromise
    : null
}

const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>()
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const sessionResponse = (await getSessionFromWindow())?.response

      if (instanceOfSession(sessionResponse)) {
        const responseProfile = sessionResponse.namespaces.profile

        setProfile(responseProfile)
      } else {
        setProfile(null)
      }

      setIsProfileLoading(false)
    }

    getSession()
  })

  return { isProfileLoading, profile }
}

export default useProfile

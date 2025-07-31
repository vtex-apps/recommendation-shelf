function getCookie(name: string): string | null {
  const regex = new RegExp(`(^|;)[ ]*${name}=([^;]*)`)
  const match = regex.exec(document.cookie)

  return match ? decodeURIComponent(match[2]) : null
}

export function getUserIdFromCookie(): string {
  const recommendationUser = getCookie('vtex-rec-user-id')
  const syneryUser = getCookie('_snrs_uuid')

  return recommendationUser ?? syneryUser ?? ''
}

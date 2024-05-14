export default function setCookie(name: string, val: string) {
  const date = new Date()
  const value = val

  // Set it expire in 59 minutes
  date.setTime(date.getTime() + 59 * 60 * 1000)

  // Set it
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

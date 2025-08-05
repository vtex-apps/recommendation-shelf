export function getWithRetry<T>(
  getFn: () => T,
  retries = 30,
  delay = 200
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      try {
        const result = getFn()

        if (!result) {
          throw new Error('Result is undefined or null')
        }

        resolve(result)
      } catch (error) {
        if (n <= 1) {
          reject(error)
        } else {
          setTimeout(() => attempt(n - 1), delay + (retries - n) * delay)
        }
      }
    }

    attempt(retries)
  })
}

export function normalizePath(path: string): string {
  if (!path) return '/'

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`

  if (withLeadingSlash !== '/' && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1)
  }

  return withLeadingSlash
}

export function isPathHidden(
  currentPath: string,
  hiddenPaths?: string[]
): boolean {
  if (!hiddenPaths?.length) return false

  const normalizedCurrent = normalizePath(currentPath)

  return hiddenPaths.some((hiddenPath) => {
    const isWildcard = hiddenPath.endsWith('*')
    const pathWithoutWildcard = isWildcard
      ? hiddenPath.slice(0, -1)
      : hiddenPath

    const normalizedHidden = normalizePath(pathWithoutWildcard)

    if (isWildcard) {
      return (
        normalizedCurrent === normalizedHidden ||
        normalizedCurrent.startsWith(`${normalizedHidden}/`)
      )
    }

    return normalizedCurrent === normalizedHidden
  })
}

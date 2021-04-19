/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  export const useRuntime: () => {
    account: string
    page: string
    navigate: (options: NavigationOptions) => void
  }
  export const ExtensionPoint
  export const useSSR
}

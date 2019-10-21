/* Typings for `render-runtime` */
declare module "vtex.render-runtime" {
  export const useRuntime: () => {
    account: string;
    navigate: (options: NavigationOptions) => void;
  };
}

import type { FunctionComponent } from 'react'

declare global {
  /* eslint-disable @typescript-eslint/ban-types */
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }
}

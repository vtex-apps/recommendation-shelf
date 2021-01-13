declare module '*.gql' {
  import type { DocumentNode } from 'graphql'

  const query: DocumentNode
  export default query
}

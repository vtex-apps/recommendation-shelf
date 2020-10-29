declare module '*.gql' {
  import { DocumentNode } from 'graphql'

  const query: DocumentNode
  export default query
}

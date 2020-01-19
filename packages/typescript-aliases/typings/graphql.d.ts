// https://goo.gl/wUE7Ed
declare module '*.graphql' {
  const content: import('graphql').DocumentNode
  // export = content;
  export default content
}

type GRAPHQL_DOCUMENT = import('graphql').DocumentNode | string

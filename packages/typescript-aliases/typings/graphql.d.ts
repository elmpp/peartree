// https://goo.gl/wUE7Ed
declare module '*.graphql' {
  import {DocumentNode} from 'graphql';

  const content: DocumentNode;
  // export = content;
  export default content;
}

type GRAPHQL_DOCUMENT = import('graphql').DocumentNode | string

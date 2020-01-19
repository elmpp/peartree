/// <reference path="./webpack-config-helpers.d.ts" />

/**
 * razzle-dev-utils - https://tinyurl.com/yxzqw6v8
 */
declare module 'razzle-dev-utils/printErrors' {
  const defaultAny: any
  export default defaultAny
}
declare module 'razzle-dev-utils/logger' {
  // https://tinyurl.com/y4yopklq
  interface Logger {
    start: (string) => void
    done: (string) => void
    error: (string) => void
    info: (string) => void
    debug: (string) => void
    warn: (string) => void
  }
  const defaultAny: any
  export default defaultAny
}
declare module 'razzle-dev-utils/setPorts' {
  const defaultAny: any
  export default defaultAny
}

declare module 'razzle-dev-utils/WebpackConfigHelpers' {
  const defaultAny: typeof WebpackConfigHelpers
  export default defaultAny
}

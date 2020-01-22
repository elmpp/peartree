/**
 *  - more info on SO - https://tinyurl.com/wwr5ub5
 */
declare namespace NodeJS {
  interface Process {
    noDeprecation: boolean
  }
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
  }
}

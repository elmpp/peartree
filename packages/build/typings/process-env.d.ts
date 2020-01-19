

declare namespace NodeJS {
  interface Process {
    noDeprecation: boolean,
  }
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development',
  }
}
declare module 'start-server-webpack-plugin' {
  interface StartServerWebpackPlugin {
    new (args: Args): any
  }
  const defaultVar: StartServerWebpackPlugin
  // plugin args - https://tinyurl.com/yyvyrox5
  export interface Args {
    name?: string
    nodeArgs?: string[]
    args?: string[]
    signal?: false | true | 'SIGUSR2'
    keyboard?: boolean
  }
  export default defaultVar
}

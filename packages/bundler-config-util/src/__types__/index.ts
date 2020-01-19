import {
  Configuration as WebpackConfigurationOrig,
  Plugin as WebpackPlugin,
  ExternalsFunctionElement,
  ExternalsElement,
  DefinePlugin,
} from 'webpack'

/**
 * The standard webpack format is way too flexible - let's constrain it for our consumption
 */
export type WebpackConfiguration = Omit<
  Omit<Omit<Omit<WebpackConfigurationOrig, 'plugins'>, 'externals'>, 'resolve'>,
  'module'
> &
  RequiredProper<{
    plugins: (WebpackPlugin & {definitions?: any})[]
    resolve: WebpackConfigurationOrig['resolve']
    module: WebpackConfigurationOrig['module']
  }> & {
    externals?: (ExternalsFunctionElement | ExternalsElement)[]
  }

export type Configuration = WebpackConfiguration // | MetroConfiguration
export type Plugin<P> = (options: P) => <T extends Configuration>(config: T) => T

export type IsDev = <T extends Configuration>(config: T) => boolean
export type IsServer = <T extends Configuration>(config: T) => boolean
export type IsClient = <T extends Configuration>(config: T) => boolean

export type Target = 'node' | 'web' // | 'mobile'

export type Env = 'production' | 'development'

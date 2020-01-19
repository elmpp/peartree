import webpack, {
  Configuration as WebpackConfigurationOrig,
  Plugin as WebpackPlugin,
  ExternalsFunctionElement,
  ExternalsElement,
} from 'webpack'

export type Target = 'node' | 'web' // | 'mobile'

export type Env = 'production' | 'development'

export type WebpackObject = typeof webpack

export interface Options {
  nodeBundle?: string
  buildDir?: string
  // webBundle: string,
  host?: string
  port?: number
  // plugins?: PluginsConfUnion[]
  serverEntryPoint?: string
  hotModuleReplacement?: boolean
  mode: Env
  target: Target
}

/**
 * The standard webpack format is way too flexible - let's constrain it for our consumption
 */
export type ConfigurationNode = OmitUnion<
  WebpackConfigurationOrig,
  'externals' | 'resolve' | 'module' | 'output' | 'target' | 'entry'
> &
  RequiredProper<{
    resolve: WebpackConfigurationOrig['resolve']
    module: WebpackConfigurationOrig['module']
    output: WebpackConfigurationOrig['output']
  }> & {
    externals?: (ExternalsFunctionElement | ExternalsElement)[]
    target: 'node'
    entry: string[]
  }
export type ConfigurationWeb = OmitUnion<
  WebpackConfigurationOrig,
  'externals' | 'resolve' | 'module' | 'output' | 'target' | 'entry'
> &
  RequiredProper<{
    resolve: WebpackConfigurationOrig['resolve']
    module: WebpackConfigurationOrig['module']
    // output: WebpackConfigurationOrig['output']
    entry: string[]
  }> & {
    target: 'web'
  }
export type Configuration = ConfigurationNode | ConfigurationWeb

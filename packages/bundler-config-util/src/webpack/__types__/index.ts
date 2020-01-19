/**
 * Package types
 *
 *  - webpack typings - https://tinyurl.com/ybmka5gd
 */

import webpack from 'webpack'

// /**
//  * The standard webpack format is way too flexible - let's constrain it for our consumption
//  */
// type WebpackConfigurationWithSensibleAmendments = Omit<
//   Omit<Omit<Omit<WebpackConfiguration, 'plugins'>, 'externals'>, 'resolve'>,
//   'module'
// > &
//   RequiredProper<{
//     plugins: (WebpackPlugin & {definitions?: any})[]
//     resolve: WebpackConfiguration['resolve']
//     module: WebpackConfiguration['module']
//   }> & {
//     externals?: (ExternalsFunctionElement | ExternalsElement)[]
//   }
// type OrgBuildConfiguration = WebpackConfigurationWithSensibleAmendments // keep concepts separate although equivalent

// export {OrgBuildConfiguration, WebpackConfigurationWithSensibleAmendments as WebpackConfiguration}
// export {WebpackConfigurationWithSensibleAmendments as WebpackConfiguration}

export type WebpackObject = typeof webpack

// export interface Options {
//   nodeBundle?: string
//   buildDir?: string
//   // webBundle: string,
//   host?: string
//   port?: number
//   plugins?: PluginsConfUnion[]
//   serverEntryPoint?: string
//   hotModuleReplacement?: boolean
// }

// razzle plugins ----- https://tinyurl.com/yxkzndey
// export interface UserDefinedPluginWithFuncConf {
//   func: Plugin
//   options: PluginArgs
// }
// export interface PackagedPluginByNameConf {
//   // func?: undefined // define to allow discriminating - https://tinyurl.com/yd6yrrwl
//   name: string
//   options?: PluginArgs
// }
// export type PluginFunctionConf = (
//   config: WebpackConfiguration,
//   options: PluginOptions,
//   webpackObject: WebpackObject
// ) => WebpackConfiguration

// export type PluginsConfUnion = UserDefinedPluginWithFuncConf | PackagedPluginByNameConf | PluginFunctionConf

// export interface PluginOptions {
//   target: Target
//   dev: boolean
//   [key: string]: any
// }

/**
//  * Note it takes our hybrid WebpackConfiguration and returns a good old WebpackConfigurationWithSensibleAmendments
//  */
// export type Plugin = (
//   config: WebpackConfigurationWithSensibleAmendments,
//   options: PluginOptions,
//   webpackObject: WebpackObject,
//   pluginArgs?: PluginArgs
// ) => WebpackConfigurationWithSensibleAmendments

export type PluginArgs = any

// export type ConfigWithAnyPlugins = WebpackConfiguration & {
//   plugins: any
// }
// export type ConfigWithAnyLoaders = WebpackConfiguration & {
//   module: any
// }

export type LoaderIncludeExcludeEntry = string | RegExp

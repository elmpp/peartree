/**
 * Builds upon our use of razzle-dev-utils WebpackConfigHelpers
 * to add more config-related utils
 */

import path from 'path'
import WebpackConfigHelpers from 'razzle-dev-utils/WebpackConfigHelpers'
import {DefinePlugin, RuleSetCondition, RuleSetLoader, RuleSetConditions} from 'webpack'
import webpackNodeExternals, {WhitelistOption} from 'webpack-node-externals'
import {Plugin, Configuration, ConfigurationNode} from './__types__'
import {LoaderIncludeExcludeEntry} from './__types__'

const Helpers = new WebpackConfigHelpers(process.cwd())

interface LoaderPluginArgs<T> {
  loaderName: string
  payload: T
}
// type LoaderIncludeExcludeEntry = string | RegExp
type NodeModulesSets = {
  moduleWhitelist: WhitelistOption[]
  nodeModuleDirs: string[]
}

export const isDev: (args: Pick<Configuration, 'mode'>) => boolean = config => config.mode === 'development' || false
export const isServer: (args: Pick<Configuration, 'target'>) => boolean = config => config.target === 'node'
export const isClient: (args: Pick<Configuration, 'target'>) => boolean = config => config.target === 'web'

/**
 * Adds definitions onto existing DefinePlugin definitions; adds plugin to the list otherwise
 */
export const addDefinePluginDefinitions: Plugin<Dictionary<string>> = definitions => config => {
  const pluginWrappers = Helpers.getPluginsByName<DefinePlugin>(config, 'DefinePlugin')

  if (pluginWrappers.length > 1) {
    throw Error(
      'Multiple instances of DefinePlugin found. This component assumes that you are using a single instance (or none)'
    )
  } else if (pluginWrappers.length === 0) {
    ;(config.plugins as any).push(new DefinePlugin(definitions))
  } else {
    ;(config.plugins as any)[pluginWrappers[0].index].definitions = {
      ...(config.plugins as any)[pluginWrappers[0].index].definitions,
      ...definitions,
    }
  }

  return config
}

// /**
//  * Adds to the "includes" field of 'ts-loader' meaning modules will be explicitly
//  * transpiled that otherwise maybe wouldn't (e.g. within node_modules etc)
//  */
// export const addTsLoaderIncludes: Plugin = (includableModules: string[] = []) => config => {
//   config = addLoaderIncludes(config, options, webpackObject, {loaderName: 'ts-loader', payload: includableModules})

//   // as mentioned, the babel loader will be included in rule but .babelrc doesn't apply to files outside its directory
//   //  - babel-loader docs - https://tinyurl.com/y4yp9r7g
//   //  - babel options applicable here - https://tinyurl.com/y52decrg

//   config = addLoaderOptions({loaderName: 'babel-loader', payload: {babelrc: true}})(config)

//   return config
// }

// /**
//  * Adds to the "options" field of 'ts-loader'
//  */
// export const addTsLoaderOptions: Plugin = (includableOptions: object = {}) => config => {
//   config = addLoaderOptions({loaderName: 'ts-loader', payload: includableOptions})(config)

//   return config
// }

/**
 * Merges in options to the matched loader (loaders can be subobjects of rules)
 */
// export const addLoaderOptions = (config: ConfigWithAnyLoaders, loaderName: string, optionsToMerge: any) => {
export const addLoaderOptions: Plugin<LoaderPluginArgs<any>> = ({loaderName, payload: optionsToMerge}) => config => {
  const loaderWrappers = Helpers.getLoadersByName(config, require.resolve(loaderName))

  if (!loaderWrappers.length) {
    throw Error(
      `addLoaderOptions() assumes that you are using ${loaderName}. If you are not using it, then you might need to check and test code for how would it work with other loaders`
    )
  }

  const ruleIndex: number = loaderWrappers[0].ruleIndex
  const useIndex: number = loaderWrappers[0].loaderIndex

  if (useIndex !== -1) {
    ;(config.module.rules[ruleIndex].use as RuleSetLoader[])[useIndex].options = {
      ...(config.module.rules[ruleIndex].use as any)[useIndex].options,
      ...optionsToMerge,
    }
  } else {
    config.module.rules[ruleIndex].options = {
      ...((config.module.rules[ruleIndex] as any).options || {}),
      ...optionsToMerge,
    }
  }

  return config
}

/**
 * Adds to the "includes" field of a loader meaning modules will be explicitly
 * included in loader's operation that otherwise maybe wouldn't
 * (e.g. if they're within node_modules etc)
 */
export const addLoaderIncludes: Plugin<LoaderPluginArgs<LoaderIncludeExcludeEntry[]>> = ({
  loaderName,
  payload: includableModules,
}) => config => {
  const loaderWrappers = Helpers.getLoadersByName(config, require.resolve(loaderName))

  if (!loaderWrappers.length) {
    throw Error(
      `addLoaderIncludes() assumes that you are using addLoaderIncludes ${loaderName}. If you are not using it, then you might need to check and test code for how would it work with other loaders`
    )
  }

  const ruleIndex = loaderWrappers[0].ruleIndex

  let currentInclude: RuleSetCondition[] = []
  if (config.module.rules[ruleIndex].include) {
    currentInclude = config.module.rules[ruleIndex].include as RuleSetCondition[]
  } else if (typeof config.module.rules[ruleIndex].include === 'string') {
    currentInclude = [config.module.rules[ruleIndex].include] as string[]
  }
  config.module.rules[ruleIndex].include = currentInclude.concat(includableModules)

  return config
}

/**
 * Adds to the "excludes" field of a loader meaning modules will be explicitly
 * included in loader's operation that otherwise maybe wouldn't
 * (e.g. if they're within node_modules etc)
 */
export const addLoaderExcludes: Plugin<LoaderPluginArgs<LoaderIncludeExcludeEntry[]>> = ({
  loaderName,
  payload: excludableModules = [],
}) => config => {
  const loaderWrappers = Helpers.getLoadersByName(config, require.resolve(loaderName))

  if (!loaderWrappers.length) {
    throw Error(
      `addLoaderExcludes() assumes that you are using ${loaderName}. If you are not using it, then you might need to check and test code for how would it work with other loaders`
    )
  }

  const ruleIndex = loaderWrappers[0].ruleIndex

  config.module.rules[ruleIndex].exclude = ((config.module.rules[ruleIndex].exclude as RuleSetConditions) || []).concat(
    excludableModules
  )

  return config
}

/**
 * Removes a loader by name
 */
export const removeLoader: Plugin<string> = loaderName => config => {
  const loaderWrappers = Helpers.getLoadersByName(config, require.resolve(loaderName))

  if (!loaderWrappers.length) {
    throw Error(
      `removeLoader() assumes that you are using ${loaderName}. If you are not using it, then you might need to check and test code for how would it work with other loaders`
    )
  }

  const ruleIndex = loaderWrappers[0].ruleIndex

  config.module.rules.splice(ruleIndex, 1)
  return config
}

/**
 * Externalises all modules in node_modules (i.e. not include in the bundle) except those supplied.
 * Will replace any [func] externals already defined in externals (assuming they'll also be an
 * instance of webpack-node-externals)
 *
 *  - webpack docs - https://tinyurl.com/y276muk2
 *  - npm package webpack-node-externals - https://tinyurl.com/y3c5ofhd
 */
export const externaliseNodeModules: Plugin<NodeModulesSets, ConfigurationNode> = ({
  moduleWhitelist,
  nodeModuleDirs,
}) => config => {

  const externalsWithoutFuncs = (config.externals || []).filter(external => typeof external !== 'function')

  // we will always need the webpack/hot/poll module bundled. (other externals from create-config should be passed through)
  if (isDev(config)) moduleWhitelist.push('webpack/hot/poll?300')

  config.externals = externalsWithoutFuncs.concat(
    nodeModuleDirs.map(nodeModuleDir =>
      webpackNodeExternals({
        modulesDir: path.resolve(process.cwd(), nodeModuleDir),
        whitelist: moduleWhitelist,
      })
    )
  )
  return config
}

export const addResolveExtensions: Plugin<string[]> = (extensionsToAdd = []) => config => {
  config.resolve.extensions = extensionsToAdd.concat(config.resolve.extensions!)
  return config
}

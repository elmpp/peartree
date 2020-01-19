import {PluginOptions, Plugin, Target, ConfigWithAnyLoaders, LoaderIncludeExcludeEntry} from './__types__'
import StartServerPlugin, {Args} from 'start-server-webpack-plugin'
import {
  externaliseNodeModules,
  addTsLoaderIncludes,
  addResolveExtensions,
  addLoaderIncludes,
  addLoaderExcludes,
  addDefinePluginDefinitions,
  addTsLoaderOptions,
} from './webpack-util'
// import DashboardPlugin from 'webpack-dashboard/plugin'
// import {StartServerFunctionsFrameworkPlugin} from './start-server-functions-framework'
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import util from 'util'
import path from 'path'
import {pathsToRegExp} from './config-util'
import debugFun, {IDebugger} from 'debug'
import _ from 'lodash'

// const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
// const styledComponentsTransformer = createStyledComponentsTransformer() // https://tinyurl.com/y4pa464w

const debug: IDebugger = debugFun('org-build:plugins')

// export const isDev = (options: PluginOptions) => options.dev || false
// export const isServer = (config: PluginOptions) => config.target === 'node'
// export const isClient = (config: PluginOptions) => config.target === 'web'
// export const isMobile = (config: PluginOptions) => config.target === 'mobile'

// /**
//  * Enables the start-server-webpack-plugin in dev
//  *  - GH - https://tinyurl.com/yyvyrox5
//  */
// export const startServer: Plugin = (config, options, _webpackObject, pluginArgs: Args) => {
//   if (!isDev(options)) {
//     return config
//   }

//   const nodeArgs = ['-r', 'source-map-support/register']

//   // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
//   if (process.env.INSPECT_BRK) {
//     nodeArgs.push(process.env.INSPECT_BRK)
//   } else if (process.env.INSPECT) {
//     nodeArgs.push(process.env.INSPECT)
//   }

//   config.plugins.push(
//     new StartServerPlugin({
//       name: `${options.nodeBundle}.js`,
//       nodeArgs,
//       keyboard: true,
//       ...pluginArgs,
//     })
//   )

//   return config
// }

/**
 * Pulls in env vars from package.json
 */
// export const packageJsonVars: Plugin = (config, options, webpackObject, pluginArgs: {pjsonPath: string}) => {
//   const pjson = require(pluginArgs.pjsonPath) // eslint-disable-line

//   return addDefinePluginDefinitions(config, options, webpackObject, {
//     ['process.env.APP_VERSION']: JSON.stringify(pjson.version),
//     ['process.env.APP_NAME']: JSON.stringify(pjson.name),
//   })
// }

/**
 * Allows amendment to config.output
 *
 *  - output webpack - https://tinyurl.com/y7zdvquz
 */
export const amendOutput: Plugin = (config, options, webpackObject, outputArgs: object = {}) => {
  config.output = {...config.output, ...outputArgs}
  return config
}

// /**
//  * When we want a single emitted file (e.g. packaging for lambda)
//  * Just removes "external" from config
//  */
// export const whitelistAllModules: Plugin = (
//   config,
//   _options,
//   _webpackObject,
//   _pluginArgs: {bundleableModules: LoaderIncludeExcludeEntry[]; withHoisting: true}
// ) => {
//   const {externals, ...noExternals} = config
//   return noExternals
// }

/**
 * Ensures specified modules aren't
 * defined as "external" and will be included in the bundle
 *
 * Additional modules can be simple module names or file paths e.g. 'partridge-config'
 */
// export const whitelistModules: Plugin = (
//   config,
//   options,
//   webpackObject,
//   pluginArgs: {bundleableModules: LoaderIncludeExcludeEntry[]; withHoisting: true}
// ) => {
//   const whitelist = pathsToRegExp(pluginArgs.bundleableModules)

//   debug(`whitelistModules whitelist: ${util.inspect(whitelist, {showHidden: false, depth: undefined})}`)

//   if (isServer(options)) {
//     config = externaliseNodeModules(config, options, webpackObject, {
//       moduleWhitelist: whitelist,
//       nodeModuleDirs: pluginArgs.withHoisting ? ['./node_modules', '../../node_modules'] : ['./node_modules'],
//     })
//   }

//   return config
// }

// /**
//  * Adds entry to the resolve.externals so will be explicitly ignored when packaging
//  */
// export const blacklistModules: Plugin = (
//   config,
//   options,
//   _webpackObject,
//   skippableModules: LoaderIncludeExcludeEntry[] = []
// ) => {
//   const blacklist = pathsToRegExp(skippableModules)

//   debug(`blacklistModules blacklist: ${JSON.stringify(blacklist)}`)

//   if (isServer(options)) {
//     config.externals = config.externals!.concat(blacklist)
//   }

//   return config
// }

// /**
//  * Adds modules to the typescript loader includes. (ts-loader likely paired with babel-loader also)
//  *
//  *  - GH answer - https://tinyurl.com/y4xbpy97
//  *  - razzle webpack config - https://tinyurl.com/y6sr9kp6
//  *  - webpack nodeExternals docs - https://tinyurl.com/y276muk2
//  */
// export const transpileTypescriptModules: Plugin = (
//   config,
//   options,
//   webpackObject,
//   modulesToTranspile: string[] = []
// ) => {
//   // if (isServer(options)) {
//   config = addTsLoaderIncludes(config, options, webpackObject, modulesToTranspile)
//   // }

//   return config
// }

// /**
//  * Sometimes, dependent packages may not be distributed already transpiled (particularly
//  * true for RN). We can specify modules here that should be ran through babel etc.
//  */
// export const transpileJavascriptModules: Plugin = (
//   config,
//   options,
//   webpackObject,
//   modulesToTranspile: string[] = []
// ) => {
//   // if (isServer(options)) {
//   config = addLoaderIncludes(config, options, webpackObject, {loaderName: 'babel-loader', payload: modulesToTranspile})
//   // }

//   return config
// }

/**
 * Dumps out the config
 */
// export const debugConfig: Plugin = (config, options, _webpackObject, debugTarget: Target = 'node') => {
//   if (options.target === debugTarget) {
//     // console.log(`------------------- ${debugTarget.toUpperCase()} --------------------------`)
//     // console.log(`--------------------- config ---------------------`)
//     // console.log(util.inspect(config, {showHidden: false, depth: undefined}))
//     debug(`------------------- ${debugTarget.toUpperCase()} --------------------------
//     --------------------- config ---------------------
//     ${util.inspect(config, {showHidden: false, depth: undefined})}`)
//   }

//   return config
// }

// /**
//  * Allow some differing package content based on target.
//  *  - mainFields - https://tinyurl.com/y42zbtl4
//  */
// export const setMainFields: Plugin = (config, _options, _webpackObject, mainFields: string[] = []) => {
//   config.resolve.mainFields = mainFields
//   return config
// }

// /**
//  * Also allow module files to resolve preferentially if e.g. .web.tsx extension
//  *  - module resolving with extensions - https://tinyurl.com/yxuj7fku
//  */
// export const setTargetExtensions: Plugin = (config, _options, _webpackObject, targetExtensions: string[] = []) => {
//   const extensionsForTarget = ['.js', '.jsx', '.ts', '.tsx']

//   function addExtension(extensions: string[], extensionPrefix: string) {
//     return extensions.reduce((acc, extension) => {
//       if (extensionsForTarget.findIndex(possibleExtension => possibleExtension === extension) !== -1) {
//         acc.push(`${extensionPrefix}${extension}`)
//       }
//       acc.push(extension)
//       return acc
//     }, [] as string[])
//   }

//   config.resolve.extensions = targetExtensions.reduce(addExtension, config.resolve.extensions)
//   return config
// }

// /**
//  * Tweaks things for running RNW property
//  *  - razzle + react-native-web = https://tinyurl.com/y3qk8vu3
//  */
// export const reactNativeWeb: Plugin = (config: ConfigWithAnyLoaders, _options, _webpackObject) => {
//   // Since RN web takes care of CSS, we should remove it for a #perf boost
//   config.module.rules = config.module.rules
//     .filter((rule: any) => !(rule.test && rule.test.exec && rule.test.exec('./something.css')))
//     .filter((rule: any) => !(rule.test && rule.test.exec && rule.test.exec('./something.module.css')))

//   config.resolve.alias = {
//     ...(config.resolve.alias || {}),
//     'react-native': 'react-native-web',
//   }

//   return config
// }

// /**
//  * Alias storybook as it can be a bitch when double loaded etc
//  *  - docs - https://tinyurl.com/y494agy9
//  *
//  * Add styled-components typescript webpack plugin
//  *  - https://tinyurl.com/y4pa464w
//  */
// export const styledComponents: Plugin = (config: ConfigWithAnyLoaders, options, webpackObject) => {
//   // config.resolve.alias = {
//   //   ...(config.resolve.alias || {}),
//   //   'styled-components': path.resolve(__dirname, '../../../node_modules/styled-components'),
//   // }

//   // config = {}
//   config = addTsLoaderOptions(config, options, webpackObject, {
//     getCustomTransformers: () => ({before: [styledComponentsTransformer]}),
//   })

//   return config
// }

// /**
//  * webpack loader for graqhql files (babel-driven options not reliable)
//  *  - https://tinyurl.com/y26cuofw
//  */
// export const graphqlTypes: Plugin = (config, options, webpackObject, modulesWithGraphQL: string[] = []) => {
//   // config.resolve.extensions = ['.graphql', '.gql'].concat(config.resolve.extensions)
//   addResolveExtensions(config, options, webpackObject, ['.graphql', '.gql'])
//   config.module.rules.push({
//     test: /\.(graphql|gql)$/,
//     include: modulesWithGraphQL,
//     loader: require.resolve('graphql-tag/loader'),
//   })

//   // also, file-loader needs to ignore graphql files
//   config = addLoaderExcludes(config, options, webpackObject, {loaderName: 'file-loader', payload: [/\.(graphql|gql)$/]})

//   // const fileLoaderIndex = findRuleIndexByLoader(config, 'file-loader')
//   // config.module.rules[fileLoaderIndex].exclude = config.module.rules[fileLoaderIndex].exclude.concat(/\.(graphql|gql)$/)

//   return config
// }

// /**
//  * Allow some differing package content based on target.
//  * Also allow module files to resolve preferentially if e.g. .web.tsx extension
//  *  - mainFields - https://tinyurl.com/y42zbtl4
//  *  - module resolving with extensions - https://tinyurl.com/yxuj7fku
//  */
// export const mainFieldsAndExtensionsForClientApp: Plugin = (config, options, webpackObject) => {
//   if (isServer(options)) {
//     setMainFields(config, options, webpackObject, ['source', 'module', 'main'])
//     setTargetExtensions(config, options, webpackObject, ['.node'])
//   }
//   if (isClient(options)) {
//     setMainFields(config, options, webpackObject, ['browser', 'source', 'module', 'main'])
//     setTargetExtensions(config, options, webpackObject, ['.web'])
//   }
//   // if (isMobile(options)) {
//   //   setMainFields(config, options, webpackObject, ['react-native', 'source', 'module', 'main'])
//   //   setTargetExtensions(config, options, webpackObject, platformExtensions)
//   // }

//   return config
// }

// /**
//  * Need loader for the react-native-vector-icons modules used by react-native-paper
//  * Quite difficult to align public web paths with vector-icon module directory
//  *
//  *  - inspired by - https://tinyurl.com/yyytqrv6
//  *  - razzle rule for public assets - https://tinyurl.com/y4m3wsez
//  *  - react-native-paper docs - https://tinyurl.com/yxkp52gl
//  *  - note that the Material Icons used in RNP v.3 is actually now - https://materialdesignicons.com/
//  */
// export const reactNativeVectorIcons: Plugin = (config, options, webpackObject) => {
//   config = addLoaderExcludes(config, options, webpackObject, {loaderName: 'file-loader', payload: [/\.ttf$/]})

//   config.module.rules.push({
//     test: /\.ttf$/,
//     use: [
//       {
//         loader: require.resolve('url-loader'),
//         options: {
//           // limit: 8192, // please note the ttf files are 128kb and we don't want file-loader
//           // fallback: require.resolve('file-loader'), // if options.limit is exceeded (will be the case for fonts) - https://tinyurl.com/y6ootokq
//           name: 'static/media/[name].[hash:8].[ext]',
//           // publicPath: `/_next/static/fonts/`,
//           // outputPath: `${isServer ? "../" : ""}static/fonts/`,
//           include: path.resolve(__dirname, '../../node_modules/react-native-vector-icons'), // (no-hoist rule essential) https://tinyurl.com/y2f24huj
//         },
//       },
//     ],
//   })
//   return config
// }

// /**
//  * Ignore node_modules when watching but include our dev packages. Doesn't seem to be working right now?
//  *
//  *  - watchOptions webpack - https://tinyurl.com/s69wxkn
//  *  - symlinks webpack - // https://tinyurl.com/rgvv67x
//  */
// export const watchDevPackages: Plugin = (config, _options, _webpackObject, devPackages: string[]) => {
//   const packagesBaseNames = devPackages.map(aPackage => path.basename(aPackage)).join('|')
//   config.watchOptions = _.merge(config.watchOptions || {}, {
//     ignored: RegExp(`node_modules\/(?!${packagesBaseNames})`),
//   })

//   config.resolve.symlinks = true

//   return config
// }

// /**
//  * Adds assorted extra useful DefinePlugin vars
//  */
// export const definePluginVars: Plugin = (config, options, webpackObject) => {
//   return addDefinePluginDefinitions(config, options, webpackObject, {
//     ['process.env.BUILD_TARGET']: JSON.stringify(options.target),
//   })
// }

// /**
//  * Visualise the build. Run "webpack-dashboard" electron app before launch
//  *  - plugin - https://tinyurl.com/y68pkot9
//  *  - electron dashboard (installed via brew) - https://tinyurl.com/y3dmcxbs
//  */
// export const webpackDashboard: Plugin = (config, options, _webpackObject) => {
//   if (process.env.__BUNDLE_ANALYSER_WEB_ENABLE && isClient(options)) {
//     config.plugins.push(new DashboardPlugin())
//   }
//   if (process.env.__BUNDLE_ANALYSER_NODE_ENABLE && isServer(options)) {
//     config.plugins.push(new DashboardPlugin())
//   }

//   return config
// }

/**
 * Analyse the contents of the web bundle
 *  - webpack-bundle-analyzer - https://tinyurl.com/yy4jveaq
 */
// export const webpackAnalyzer: Plugin = (config, options, _webpackObject) => {
//   if (process.env.__BUNDLE_ANALYSER_WEB_ENABLE && isClient(options)) {
//     config.plugins.push(
//       new BundleAnalyzerPlugin({
//         analyzerPort: 3023,
//       })
//     )
//   }
//   if (process.env.__BUNDLE_ANALYSER_NODE_ENABLE && isServer(options)) {
//     config.plugins.push(
//       new BundleAnalyzerPlugin({
//         analyzerPort: 3023,
//       })
//     )
//   }

//   return config
// }

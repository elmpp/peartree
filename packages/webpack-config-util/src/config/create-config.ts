/**
 * Inspired by Razzle's create-config, this will create a minimal webpack
 * config for packaging a runnable app.
 *
 * Goals:
 *  - Support only node packages with single entrypoint before plugins
 *  - Should support webpackDevPlugin in dev mode
 *  - NODE_ENV will be required when building and defines the webpack mode (minification level etc)
 * but not which plugins will be loaded etc
 *
 * Reference:
 *  - razzle create-config - https://tinyurl.com/y4f8mqxe
 *  - uses react-dev-utils (subpackage of CRA) under the hood - https://tinyurl.com/y5nwdsso
 */

import fs from 'fs-extra'
import {Options, WebpackObject, Configuration, ConfigurationWeb, ConfigurationNode} from '../__types__'
// import {runAllPlugins} from './run-plugin'
import {paths} from './paths'
import nodeExternals, {WhitelistOption} from 'webpack-node-externals'
import webpack from 'webpack'
import WebpackBar from 'webpackbar'
import {isDev, isServer, isClient} from '../config-util'

export const createConfig = (
  // target: Target,
  // env: Env, // this defines the contents of the build (plugins etc). Does not effect NODE_ENV
  options: Options,
  // _webpackObject: WebpackObject
): Configuration => {
  // const pluginOptions = {
  //   host: 'localhost',
  //   port: 3000,
  //   // plugins: [],
  //   nodeBundle: 'server',
  //   buildDir: paths.appBuild,
  //   serverEntryPoint: paths.appServerEntrypoint,
  //   ...options,
  //   // dev: env === 'development',
  //   target,
  //   mode: options.mode,
  // }
  const {host = 'localhost', port = 3000, mode, target, nodeBundle = 'index', buildDir = 'dist', serverEntryPoint = 'index.js'} = options

  // const IS_NODE = isServer(options)
  const IS_DEV = isDev(options)
  const IS_CLIENT = isClient(options)
  const hotModuleReplacement = IS_CLIENT

  const common: Partial<Configuration> = {
    // Set webpack mode: - https://tinyurl.com/y63xsarr
    mode: mode,
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    // target,
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // We need to tell webpack how to resolve both Razzle's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.mjs', '.jsx', '.js', '.json'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
      },
    },
    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        // { parser: { requireEnsure: false } },
        // Avoid "require is not defined" errors
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        // Transform ES6 with Babel
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.appSrc],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: setupBabel(),
            },
          ],
        },
        // {
        //   exclude: [
        //     /\.html$/,
        //     /\.(js|jsx|mjs)$/,
        //     /\.(ts|tsx)$/,
        //     /\.(vue)$/,
        //     /\.(less)$/,
        //     /\.(re)$/,
        //     /\.(s?css|sass)$/,
        //     /\.json$/,
        //     /\.bmp$/,
        //     /\.gif$/,
        //     /\.jpe?g$/,
        //     /\.png$/,
        //   ],
        //   loader: require.resolve('file-loader'),
        //   options: {
        //     name: 'static/media/[name].[hash:8].[ext]',
        //     emitFile: IS_WEB,
        //   },
        // },
        // // "url" loader works like "file" loader except that it embeds assets
        // // smaller than specified limit in bytes as data URLs to avoid requests.
        // // A missing `test` is equivalent to a match.
        // {
        //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        //   loader: require.resolve('url-loader'),
        //   options: {
        //     limit: 10000,
        //     name: 'static/media/[name].[hash:8].[ext]',
        //     emitFile: IS_WEB,
        //   },
        // },
      ],
    },
    plugins: [],
  }
  // let config: Configuration

  if (IS_CLIENT) {
    return {
      ...(common as ConfigurationWeb),
      target: 'web',
    } as ConfigurationWeb
  } else {
    const nodeConfig: Partial<ConfigurationNode> = {
      // We want to uphold node's __filename, and __dirname.
      node: {
        __console: false,
        __dirname: false,
        __filename: false,
      },
      // We need to tell webpack what to bundle into our Node bundle.
      externals: [
        nodeExternals({
          whitelist: [
            hotModuleReplacement ? 'webpack/hot/poll?300' : undefined,
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/,
          ].filter(x => x) as WhitelistOption[],
        }),
      ],
      // Specify webpack Node.js output path and filename
      output: {
        path: buildDir,
        filename: `${nodeBundle}.js`,
        libraryTarget: 'commonjs2',
        // library: 'importer',z
      },
      plugins: [
        ...(common.plugins || []),
        // Prevent creating multiple chunks for the server
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
        new WebpackBar({
          color: '#c065f4',
          name: 'server',
        }),
      ],
    }

    nodeConfig.entry = [serverEntryPoint]

    if (IS_DEV) {
      // Use watch mode
      nodeConfig.watch = true
      hotModuleReplacement && nodeConfig.entry!.unshift('webpack/hot/poll?300')

      // Pretty format server errors
      nodeConfig.entry!.unshift('razzle-dev-utils/prettyNodeErrors')

      if (hotModuleReplacement) {
        nodeConfig.plugins = [
          ...(nodeConfig.plugins || []),
          // Add hot module replacement
          new webpack.HotModuleReplacementPlugin(),
          // Ignore assets.json to avoid infinite recompile bug
          new webpack.WatchIgnorePlugin([paths.appManifest]),
        ]
      }
    }

    return {
      ...(common as ConfigurationNode),
      ...(nodeConfig as ConfigurationNode),
      target: 'node',
    } as ConfigurationNode
  }

  // const pluginsToRun = [
  //   {
  //     name: 'typescript', // typescript plugin setup - https://tinyurl.com/yxq9lsra
  //     options: {
  //       useBabel: true, // run's babel as well as ts-loader for tsx/jsx files - https://tinyurl.com/yxozjytu
  //     },
  //   },
  //   ...plugins,
  // ]

  // // Apply razzle plugins, if they are present in razzle.config.js
  // config = runAllPlugins(config, pluginsToRun, pluginOptions, webpackObject)
}

// export const runAllPlugins = (config: OrgBuildConfiguration, plugins: PluginsConfUnion[], options: PluginOptions, webpackObject: WebpackObject): Configuration => {
//   // Apply razzle plugins, if they are present in razzle.config.js
//   plugins.forEach((plugin) => {
//     config = runPlugin(plugin, config, options, webpackObject)
//   })
//   return config
// }

const setupBabel = () => {
  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-razzle.
  const hasBabelRc = paths.appBabelRc.some(babelRcPath => fs.existsSync(babelRcPath))
  const mainBabelOptions = {
    presets: [] as string[],
    babelrc: true,
    cacheDirectory: true,
  }

  if (!hasBabelRc) {
    mainBabelOptions.presets.push(require.resolve('babel-preset-razzle'))
  }

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root')
  }
  return mainBabelOptions
}

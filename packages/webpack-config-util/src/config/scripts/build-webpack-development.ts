#! /usr/bin/env ts-node
'use strict'

/**
 * Creates a webpack configuration suitable for development
 * By default will have:
 *  - watch
 *  - debugger
 */

import {Configuration} from '../../__types__'
import fs from 'fs-extra'
import webpack, {WatchOptions} from 'webpack'
import {paths} from '../paths'
import clearConsole from 'react-dev-utils/clearConsole'
import printErrors from 'razzle-dev-utils/printErrors'
import logger from 'razzle-dev-utils/logger'
import setPorts from 'razzle-dev-utils/setPorts'
import {readOptions, createConfigWithPlugins} from './common'

process.noDeprecation = true // turns off that loadQuery clutter.

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || ''
process.env.INSPECT = process.argv.find(arg => arg.match(/--inspect(=|$)/)) || ''

function main() {
  // Optimistically, we make the console look exactly like the output of our
  // FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
  clearConsole()
  logger.start('Compiling...')

  const options = readOptions(paths.appConfig, logger)
  const webpackConf = createConfigWithPlugins({mode: process.env.NODE_ENV, ...options})

  // Delete assets.json to always have a manifest up to date
  fs.removeSync(paths.appManifest)

  // Create dev configs using our config factory, passing in razzle file as
  // options.
  // let clientConfig = createConfig('web', 'dev', razzle, webpack);
  // const serverConfig = createConfig('node', process.env.NODE_ENV, {...razzle, hotModuleReplacement: false}, webpack)

  // Compile our assets with webpack
  // const clientCompiler = compile(clientConfig);
  const serverCompiler = compile(webpackConf)
  logger.info('Compile done')
  // // Instatiate a variable to track server watching
  // let watching

  // Otherwise, create a new watcher for our server code.
  serverCompiler.watch(
    {
      quiet: false,
      // stats: 'none', // none |
    } as WatchOptions,
    /* eslint-disable no-unused-vars */
    _stats => {
      logger.info(_stats)
    }
  )
  logger.done('All done')
}

/**
 * Webpack compile in a try-catch
 *  - note because we invoke webpack with 1 arg, we return a webpack.compiler - https://tinyurl.com/y4d49ns8
 */
function compile(config: Configuration): webpack.Compiler {
  try {
    return webpack(config)
  } catch (e) {
    printErrors('Failed to compile.', [e])
    return process.exit(1)
  }
}

setPorts()
  .then(main)
  .catch(console.error)

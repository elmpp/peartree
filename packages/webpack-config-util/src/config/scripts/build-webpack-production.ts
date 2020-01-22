#! /usr/bin/env ts-node
'use strict'

/**
 * From razzle - https://tinyurl.com/yyss7zzl
 */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
// import('../env')

import {Configuration} from '../../__types__'
import webpack, {Compiler, Stats} from 'webpack'
import fs from 'fs-extra'
import chalk from 'chalk'
import {paths} from '../paths'
import printErrors from 'razzle-dev-utils/printErrors'
import logger from 'razzle-dev-utils/logger'
import FileSizeReporter, {OpaqueFileSizes} from 'react-dev-utils/FileSizeReporter'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
import printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
import {readOptions, createConfigWithPlugins} from './common'

const razzle = readOptions(paths.appConfig, logger)

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
// eslint-disable-next-line promise/catch-or-return
measureFileSizesBeforeBuild(razzle.buildDir || paths.appBuild)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild) // only remove the default /build dir as sometimes emit to root

    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    ({stats, previousFileSizes, warnings}) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
        console.log(
          '\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.'
        )
        console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n')
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }
      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild)
      console.log()
      return
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'))
      console.log((err.message || err) + '\n')
      process.exit(1)
    }
  )

function build(previousFileSizes: OpaqueFileSizes) {
  //   // Check if razzle.config.js exists
  //   let razzle: Options = {}
  //   try {
  //     razzle = require(paths.appConfig).default
  // console.log('razzle :', razzle);
  //     /* eslint-disable no-empty */
  //   } catch (e) {}
  //   /* eslint-enable */

  // const razzle = readOptions(paths.appConfig, logger)

  //   if (razzle.clearConsole === false || !!razzle.host || !!razzle.port) {
  //     logger.warn(`Specifying options \`port\`, \`host\`, and \`clearConsole\` in razzle.config.js has been deprecated.
  // Please use a .env file instead.

  // ${razzle.host !== 'localhost' && `HOST=${razzle.host}`}
  // ${razzle.port !== '3000' && `PORT=${razzle.port}`}
  // `);
  //   }

  // Create our production webpack configurations and pass in razzle options.
  // let clientConfig = createConfig('web', 'prod', razzle, webpack);

  const options = readOptions(paths.appConfig, logger)
  const webpackConf = createConfigWithPlugins({mode: process.env.NODE_ENV, ...options})

  process.noDeprecation = true // turns off that loadQuery clutter.

  console.log('Creating an optimized production build...')
  // First compile the client. We need it to properly output assets.json (asset
  // manifest file with the correct hashes on file names BEFORE we can start
  // the server compiler.
  return new Promise((resolve, reject) => {
    // compile(clientConfig, (err, clientStats) => {
    //   if (err) {
    //     reject(err);
    //   }
    //   const clientMessages = formatWebpackMessages(
    //     clientStats.toJson({}, true)
    //   );
    //   if (clientMessages.errors.length) {
    //     return reject(new Error(clientMessages.errors.join('\n\n')));
    //   }
    //   if (
    //     process.env.CI &&
    //     (typeof process.env.CI !== 'string' ||
    //       process.env.CI.toLowerCase() !== 'false') &&
    //     clientMessages.warnings.length
    //   ) {
    //     console.log(
    //       chalk.yellow(
    //         '\nTreating warnings as errors because process.env.CI = true.\n' +
    //           'Most CI servers set it automatically.\n'
    //       )
    //     );
    //     return reject(new Error(clientMessages.warnings.join('\n\n')));
    //   }

    //   console.log(chalk.green('Compiled client successfully.'));
    console.log('Compiling server...')
    compile(webpackConf, (err: Error | undefined, serverStats: Stats) => {
      if (err) {
        reject(err)
      }
      const serverMessages = formatWebpackMessages(serverStats.toJson({}, true))
      if (serverMessages.errors.length) {
        return reject(new Error(serverMessages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        serverMessages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' + 'Most CI servers set it automatically.\n'
          )
        )
        return reject(new Error(serverMessages.warnings.join('\n\n')))
      }
      console.log(chalk.green('Compiled server successfully.'))
      return resolve({
        stats: serverStats,
        previousFileSizes,
        warnings: {
          // clientMessages.warnings,
          ...serverMessages.warnings,
        },
      })
    })
  })
}

// Wrap webpack compile in a try catch.
function compile(config: Configuration, cb: (err: Error | undefined, stats: Stats) => void) {
  let compiler: Compiler
  try {
    compiler = webpack(config)
    compiler.run((err, stats) => {
      cb(err, stats)
    })
  } catch (e) {
    printErrors('Failed to compile.', [e])
    return process.exit(1)
  }
  return undefined
}

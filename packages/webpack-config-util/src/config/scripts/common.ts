/**
 * Code common to ./build and ./start
 */

import {Options} from '../../__types__'
import logger from 'razzle-dev-utils/logger'
import {createConfig} from '../create-config'
import clearConsole from 'react-dev-utils/clearConsole'
import fs from 'fs-extra'

export const readOptions = (filePath: string, utilsLogger: typeof logger): Options => {
  let options: Options

  // Check for webpack.config.js file...
  if (!fs.existsSync(filePath)) {
    throw new Error(`No file found as ${filePath}. Continuing with defaults...`)
  }

  try {
    options = require(filePath)
    // console.log('options :', options);
  } catch (e) {
    clearConsole()
    utilsLogger.error('Invalid webpack.config.js file.', e)
    process.exit(1)
  }
  return options
}

export const createConfigWithPlugins = (options: Options) => {
  const {plugins, ...otherOptions} = options
  const config = createConfig(otherOptions)
  return plugins
    ? plugins.reduceRight(
        (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
        value => value
      )(config)
    : config
}

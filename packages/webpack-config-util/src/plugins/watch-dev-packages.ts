import {Plugin} from '../__types__'
import path from 'path'
import _ from 'lodash'

/**
 * Ignore node_modules when watching but include our dev packages. Doesn't seem to be working right now?
 *
 *  - watchOptions webpack - https://tinyurl.com/s69wxkn
 *  - symlinks webpack - // https://tinyurl.com/rgvv67x
 */
export const watchDevPackages: Plugin<string[]> = devPackages => config => {
  const packagesBaseNames = devPackages.map(aPackage => path.basename(aPackage)).join('|')
  config.watchOptions = _.merge(config.watchOptions || {}, {
    ignored: RegExp(`node_modules/(?!${packagesBaseNames})`),
  })

  config.resolve.symlinks = true

  return config
}

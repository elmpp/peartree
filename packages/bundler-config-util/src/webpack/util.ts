/**
 * Util functions suitable for consumption in a buildable package's "webpack.config.js"
 */

import getDevPaths from 'get-dev-paths'
import path from 'path'
import fs from 'fs'
import {LoaderIncludeExcludeEntry} from './__types__'
import _ from 'lodash'

/**
 * Any dependencies we have from our monorepo can be found here.
 * Useful for omitting from nodeExternals so will be in the bundle
 */
export const getDevPackagesPaths = (): string[] => {
  return getDevPaths(fs.realpathSync(process.cwd()))
    .map($ => fs.realpathSync($))
    .filter((value, index, existing) => {
      return existing.indexOf(value) === index
    })
}

/**
 * Often webpack requires RegExp instead of full filepaths (e.g. resolve.externals)
 */
export const pathsToRegExp = (paths: LoaderIncludeExcludeEntry[]): RegExp[] =>
  paths
    .map($ => {
      if ($ instanceof RegExp) {
        return $ as RegExp
      }
      $ = isFilepath($ as string) ? path.basename($ as string) : $
      return new RegExp(_.escapeRegExp($ as string))
    })
    .filter((value, index, existing) => {
      return existing.indexOf(value) === index
    })

/**
 * Often webpack requires RegExp instead of full filepaths (e.g. resolve.externals)
 */
export const pathsToModuleName = (paths: LoaderIncludeExcludeEntry[]): LoaderIncludeExcludeEntry[] =>
  paths
    .map($ => {
      if ($ instanceof RegExp) {
        return ($ as RegExp).source
      }
      return $ as string
    })
    .map($ => (isFilepath($) ? path.basename($) : $))
    .filter((value, index, existing) => {
      return existing.indexOf(value) === index
    })

export const isFilepath = (path: string) => {
  return path.match(/^(?:\.\.\/|\/|\.\/)/)
}

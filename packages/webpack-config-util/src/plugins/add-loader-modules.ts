import {Plugin, LoaderPluginArgs, LoaderIncludeExcludeEntry} from '../__types__'
import {addLoaderIncludes} from '../config-util'

/**
 * Adds modules to the loader includes
 *
 * ```
 * import {getDevPackagesPaths} from 'webpack-config-utils'
 * import {addLoaderModules} from 'webpack-config-utils/plugins'
 * const configuredPlugin = addLoaderModules({payload: getDevPackagePaths(), loaderName: 'ts-loader'})
 * ```
 *
 *  - GH answer - https://tinyurl.com/y4xbpy97
 *  - razzle webpack config - https://tinyurl.com/y6sr9kp6
 *  - webpack nodeExternals docs - https://tinyurl.com/y276muk2
 */
export const addLoaderModules: Plugin<LoaderPluginArgs<LoaderIncludeExcludeEntry[]>> = ({
  payload,
  loaderName,
}) => config => {
  config = addLoaderIncludes({loaderName, payload})(config)

  return config
}

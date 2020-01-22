import {Plugin, ConfigurationNode} from '../__types__'
import {LoaderIncludeExcludeEntry} from '../__types__'
import {isServer, externaliseNodeModules} from '../config-util'
import {pathsToRegExp} from '../util'

/**
 * Ensures specified modules aren't
 * defined as "external" and will be included in the bundle
 *
 * Additional modules can be simple module names or file paths e.g. 'partridge-config'
 */
export const whitelistModules: Plugin<
  {
    bundleableModules: LoaderIncludeExcludeEntry[]
    withHoisting: true
  },
  ConfigurationNode
> = pluginArgs => config => {
  const whitelist = pathsToRegExp(pluginArgs.bundleableModules)

  if (isServer(config)) {
    config = externaliseNodeModules({
      moduleWhitelist: whitelist,
      nodeModuleDirs: pluginArgs.withHoisting ? ['./node_modules', '../../node_modules'] : ['./node_modules'],
    })(config)
  }

  return config
}

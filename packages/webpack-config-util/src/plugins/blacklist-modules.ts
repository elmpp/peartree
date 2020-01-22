import {Plugin, ConfigurationNode} from '../__types__'
import {LoaderIncludeExcludeEntry} from '../__types__'
import {isServer} from '../config-util'
import {pathsToRegExp} from '../util'

/**
 * Adds entry to the resolve.externals so will be explicitly ignored when packaging
 */
export const blacklistModules: Plugin<LoaderIncludeExcludeEntry[], ConfigurationNode> = (
  skippableModules = []
) => config => {
  const blacklist = pathsToRegExp(skippableModules)

  if (isServer(config)) {
    config.externals = config.externals!.concat(blacklist)
  }

  return config
}

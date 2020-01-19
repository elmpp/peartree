import {Plugin} from '../../__types__'
import {LoaderIncludeExcludeEntry} from '../__types__'

/**
 * When we want a single emitted file (e.g. packaging for lambda)
 * Just removes "external" from config
 */
export const whitelistAllModules: Plugin<{
  bundleableModules: LoaderIncludeExcludeEntry[]
  withHoisting: true
}> = _pluginArgs => config => {
  delete config.externals
  return config
}

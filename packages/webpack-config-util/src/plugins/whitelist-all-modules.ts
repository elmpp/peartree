import {Plugin, ConfigurationNode, Configuration} from '../__types__'

/**
 * When we want a single emitted file (e.g. packaging for lambda)
 * Just removes "external" from config
 */
export const whitelistAllModules: Plugin = () => config => {
  // delete config.externals
  return config
}

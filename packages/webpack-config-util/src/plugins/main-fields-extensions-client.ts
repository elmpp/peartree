import {Plugin} from '../__types__'
import {isServer, isClient} from '../config-util'
import {mainFields} from './main-fields'
import {targetExtensions} from './target-extensions'

/**
 * Allow some differing package content based on target.
 * Also allow module files to resolve preferentially if e.g. .web.tsx extension
 *  - mainFields - https://tinyurl.com/y42zbtl4
 *  - module resolving with extensions - https://tinyurl.com/yxuj7fku
 */
export const mainFieldsExtensionsClient: Plugin<undefined> = () => config => {
  if (isServer(config)) {
    mainFields(['source', 'module', 'main'])(config)
    targetExtensions(['.node'])(config)
  }
  if (isClient(config)) {
    mainFields(['browser', 'source', 'module', 'main'])(config)
    targetExtensions(['.web'])(config)
  }
  // if (isMobile(options)) {
  //   setMainFields(config, options, webpackObject, ['react-native', 'source', 'module', 'main'])
  //   setTargetExtensions(config, options, webpackObject, platformExtensions)
  // }

  return config
}

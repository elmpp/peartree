import {Plugin} from '../../__types__'
import {isServer, isClient} from '../config-util'
import {setMainFields} from './main-fields'
import {setTargetExtensions} from './target-extensions'

/**
 * Allow some differing package content based on target.
 * Also allow module files to resolve preferentially if e.g. .web.tsx extension
 *  - mainFields - https://tinyurl.com/y42zbtl4
 *  - module resolving with extensions - https://tinyurl.com/yxuj7fku
 */
export const mainFieldsAndExtensionsForClientApp: Plugin<never> = () => config => {
  if (isServer(config)) {
    setMainFields(['source', 'module', 'main'])(config)
    setTargetExtensions(['.node'])(config)
  }
  if (isClient(config)) {
    setMainFields(['browser', 'source', 'module', 'main'])(config)
    setTargetExtensions(['.web'])(config)
  }
  // if (isMobile(options)) {
  //   setMainFields(config, options, webpackObject, ['react-native', 'source', 'module', 'main'])
  //   setTargetExtensions(config, options, webpackObject, platformExtensions)
  // }

  return config
}

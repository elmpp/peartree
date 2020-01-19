import {Plugin} from '../../__types__'
import {addDefinePluginDefinitions} from '../config-util'

/**
 * Adds assorted extra useful DefinePlugin vars
 */
export const definePluginVars: Plugin<never> = () => config => {
  return addDefinePluginDefinitions({
    ['process.env.BUILD_TARGET']: JSON.stringify(config.target),
  })(config)
}

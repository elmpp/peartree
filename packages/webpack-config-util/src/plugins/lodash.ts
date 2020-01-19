import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import {Plugin} from '../../__types__'

/**
 * lodash cherry-picking. Needs the babel plugin in babel.config.js also!
 *  - webpack plugin - https://tinyurl.com/y58ukgxa
 *  - babel plugin (via babel.config.js) - https://tinyurl.com/y3m55xuo
 */
export const lodash: Plugin<never> = () => config => {
  config.plugins.push(new LodashModuleReplacementPlugin())
  return config
}

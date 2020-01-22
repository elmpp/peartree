import {Plugin} from '../__types__'
import {addLoaderIncludes} from '../config-util'

/**
 * Adds modules to the typescript loader includes. (ts-loader likely paired with babel-loader also)
 *
 *  - GH answer - https://tinyurl.com/y4xbpy97
 *  - razzle webpack config - https://tinyurl.com/y6sr9kp6
 *  - webpack nodeExternals docs - https://tinyurl.com/y276muk2
 */
export const typescriptLoader: Plugin<string[]> = (modulesToTranspile = []) => config => {
  config = addLoaderIncludes({loaderName: 'ts-loader', payload: modulesToTranspile})(config)

  return config
}

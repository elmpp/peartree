import {Plugin} from '../../__types__'
import {addLoaderIncludes} from '../config-util'

/**
 * Sometimes, dependent packages may not be distributed already transpiled (particularly
 * true for RN). We can specify modules here that should be ran through babel etc.
 */
export const javascriptLoader: Plugin<string[]> = (modulesToTranspile = []) => config => {
  config = addLoaderIncludes({loaderName: 'babel-loader', payload: modulesToTranspile})(config)

  return config
}

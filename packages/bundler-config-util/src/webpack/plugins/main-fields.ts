import {Plugin} from '../../__types__'

/**
 * Allow some differing package content based on target.
 *  - mainFields - https://tinyurl.com/y42zbtl4
 */
export const setMainFields: Plugin<string[]> = (mainFields = []) => config => {
  config.resolve.mainFields = mainFields
  return config
}

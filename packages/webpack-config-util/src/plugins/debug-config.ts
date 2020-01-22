import {Plugin, Target, Configuration} from '../__types__'
import util from 'util'

/**
 * Dumps out the config
 */
export const debugConfig: Plugin<Target> = (debugTarget: Target = 'node') => (config: Configuration) => {
  if (config.target === debugTarget) {
    console.log(`------------------- ${debugTarget.toUpperCase()} --------------------------
    --------------------- config ---------------------
    ${util.inspect(config, {showHidden: false, depth: undefined})}`)
  }

  return config
}

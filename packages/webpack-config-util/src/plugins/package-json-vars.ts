import {Plugin} from '../__types__'
import {addDefinePluginDefinitions} from '../config-util'

/**
 * Pulls in env vars from package.json
 */
export const packageJsonVars: Plugin<{pjsonPath: string}> = pluginArgs => config => {
  const pjson = require(pluginArgs.pjsonPath) // eslint-disable-line

  return addDefinePluginDefinitions({
    ['process.env.APP_VERSION']: JSON.stringify(pjson.version),
    ['process.env.APP_NAME']: JSON.stringify(pjson.name),
  })(config)
}

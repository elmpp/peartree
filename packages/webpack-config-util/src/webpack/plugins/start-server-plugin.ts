import {Plugin} from '../__types__'
import StartServerPlugin, {Args} from 'start-server-webpack-plugin'
import {isDev} from '../../config-util'

/**
 * Enables the start-server-webpack-plugin in dev
 *  - GH - https://tinyurl.com/yyvyrox5
 */
export const startServerPlugin: Plugin<Args> = pluginArgs => config => {
  if (!isDev(config)) {
    return config
  }

  const nodeArgs = ['-r', 'source-map-support/register']

  // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
  if (process.env.INSPECT_BRK) {
    nodeArgs.push(process.env.INSPECT_BRK)
  } else if (process.env.INSPECT) {
    nodeArgs.push(process.env.INSPECT)
  }

  config.plugins.push(
    new StartServerPlugin({
      name: `${config.output.filename}.js`,
      nodeArgs,
      keyboard: true,
      ...pluginArgs,
    })
  )

  return config
}

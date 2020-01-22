import DashboardPlugin from 'webpack-dashboard/plugin'
import {Plugin} from '../__types__'
import {isClient, isServer} from '../config-util'

/**
 * Visualise the build. Run "webpack-dashboard" electron app before launch
 *  - plugin - https://tinyurl.com/y68pkot9
 *  - electron dashboard (installed via brew) - https://tinyurl.com/y3dmcxbs
 */
export const webpackDashboard: Plugin<undefined> = () => config => {
  if (process.env.__BUNDLE_ANALYSER_WEB_ENABLE && isClient(config)) {
    config.plugins = (config.plugins || []).concat(new DashboardPlugin())
  }
  if (process.env.__BUNDLE_ANALYSER_NODE_ENABLE && isServer(config)) {
    config.plugins = (config.plugins || []).concat(new DashboardPlugin())
  }

  return config
}

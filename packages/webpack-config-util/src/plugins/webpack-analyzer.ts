import {Plugin} from '../../__types__'
import {isClient, isServer} from '../config-util'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'

/**
 * Analyse the contents of the web bundle
 *  - webpack-bundle-analyzer - https://tinyurl.com/yy4jveaq
 */
export const webpackAnalyzer: Plugin<never> = () => config => {
  if (process.env.__BUNDLE_ANALYSER_WEB_ENABLE && isClient(config)) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 3023,
      })
    )
  }
  if (process.env.__BUNDLE_ANALYSER_NODE_ENABLE && isServer(config)) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 3023,
      })
    )
  }

  return config
}

import {Plugin} from '../../__types__'

/**
 * Tweaks things for running RNW property
 *  - razzle + react-native-web = https://tinyurl.com/y3qk8vu3
 */
export const reactNativeWeb: Plugin<never> = () => config => {
  // Since RN web takes care of CSS, we should remove it for a #perf boost
  config.module.rules = config.module.rules
    .filter((rule: any) => !(rule.test && rule.test.exec && rule.test.exec('./something.css')))
    .filter((rule: any) => !(rule.test && rule.test.exec && rule.test.exec('./something.module.css')))

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native': 'react-native-web',
  }

  return config
}

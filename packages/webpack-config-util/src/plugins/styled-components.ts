import {Plugin} from '../__types__'
import {addLoaderOptions} from '../config-util'
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const styledComponentsTransformer = createStyledComponentsTransformer() // https://tinyurl.com/y4pa464w

/**
 * Alias storybook as it can be a bitch when double loaded etc
 *  - docs - https://tinyurl.com/y494agy9
 *
 * Add styled-components typescript webpack plugin
 *  - https://tinyurl.com/y4pa464w
 */
export const styledComponents: Plugin<undefined> = () => config => {
  // config.resolve.alias = {
  //   ...(config.resolve.alias || {}),
  //   'styled-components': path.resolve(__dirname, '../../../node_modules/styled-components'),
  // }

  // config = {}
  config = addLoaderOptions({
    loaderName: 'ts-loader',
    payload: {getCustomTransformers: () => ({before: [styledComponentsTransformer]})},
  })(config)

  return config
}

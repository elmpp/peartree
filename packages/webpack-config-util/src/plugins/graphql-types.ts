import {Plugin} from '../__types__'
import {addLoaderExcludes, addResolveExtensions} from '../config-util'

/**
 * webpack loader for graqhql files (babel-driven options not reliable)
 *  - https://tinyurl.com/y26cuofw
 */
export const graphqlTypes: Plugin<string[]> = (modulesWithGraphQL = []) => config => {
  // config.resolve.extensions = ['.graphql', '.gql'].concat(config.resolve.extensions)
  addResolveExtensions(['.graphql', '.gql'])(config)
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    include: modulesWithGraphQL,
    loader: require.resolve('graphql-tag/loader'),
  })

  // also, file-loader needs to ignore graphql files
  config = addLoaderExcludes({loaderName: 'file-loader', payload: [/\.(graphql|gql)$/]})(config)

  // const fileLoaderIndex = findRuleIndexByLoader(config, 'file-loader')
  // config.module.rules[fileLoaderIndex].exclude = config.module.rules[fileLoaderIndex].exclude.concat(/\.(graphql|gql)$/)

  return config
}

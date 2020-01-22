import {Plugin} from '../__types__'
import {addLoaderExcludes} from '../config-util'
import path from 'path'

/**
 * Need loader for the react-native-vector-icons modules used by react-native-paper
 * Quite difficult to align public web paths with vector-icon module directory
 *
 *  - inspired by - https://tinyurl.com/yyytqrv6
 *  - razzle rule for public assets - https://tinyurl.com/y4m3wsez
 *  - react-native-paper docs - https://tinyurl.com/yxkp52gl
 *  - note that the Material Icons used in RNP v.3 is actually now - https://materialdesignicons.com/
 */
export const reactNativeVectorIcons: Plugin<undefined> = () => config => {
  config = addLoaderExcludes({loaderName: 'file-loader', payload: [/\.ttf$/]})(config)

  config.module.rules.push({
    test: /\.ttf$/,
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          // limit: 8192, // please note the ttf files are 128kb and we don't want file-loader
          // fallback: require.resolve('file-loader'), // if options.limit is exceeded (will be the case for fonts) - https://tinyurl.com/y6ootokq
          name: 'static/media/[name].[hash:8].[ext]',
          // publicPath: `/_next/static/fonts/`,
          // outputPath: `${isServer ? "../" : ""}static/fonts/`,
          include: path.resolve(__dirname, '../../node_modules/react-native-vector-icons'), // (no-hoist rule essential) https://tinyurl.com/y2f24huj
        },
      },
    ],
  })
  return config
}

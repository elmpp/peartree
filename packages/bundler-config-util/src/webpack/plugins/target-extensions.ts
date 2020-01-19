import {Plugin} from '../../__types__'

/**
 * Also allow module files to resolve preferentially if e.g. .web.tsx extension
 *  - module resolving with extensions - https://tinyurl.com/yxuj7fku
 */
export const setTargetExtensions: Plugin<string[]> = (targetExtensions = []) => config => {
  const extensionsForTarget = ['.js', '.jsx', '.ts', '.tsx']

  function addExtension(extensions: string[], extensionPrefix: string) {
    return extensions.reduce((acc, extension) => {
      if (extensionsForTarget.findIndex(possibleExtension => possibleExtension === extension) !== -1) {
        acc.push(`${extensionPrefix}${extension}`)
      }
      acc.push(extension)
      return acc
    }, [] as string[])
  }

  config.resolve.extensions = targetExtensions.reduce(addExtension, config.resolve.extensions)
  return config
}

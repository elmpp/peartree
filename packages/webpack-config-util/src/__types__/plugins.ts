import {Configuration} from './config'

export type ConfiguredPlugin<T extends Configuration = Configuration> = (config: T) => T
export type Plugin<P = undefined, T extends Configuration = Configuration> = P extends undefined
  ? () => ConfiguredPlugin<T>
  : (options: P) => ConfiguredPlugin<T>

export type LoaderIncludeExcludeEntry = string | RegExp

export interface LoaderPluginArgs<T> {
  loaderName: 'ts-loader' | 'babel-loader' | 'file-loader'
  payload: T
}
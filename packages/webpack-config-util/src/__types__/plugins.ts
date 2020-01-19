import {Configuration} from './config'

export type Plugin<P> = (options: P) => <T extends Configuration>(config: T) => T

export type LoaderIncludeExcludeEntry = string | RegExp



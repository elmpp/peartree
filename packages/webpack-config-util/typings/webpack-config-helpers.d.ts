/**
 * This was generated using the project 'jsdoc-tsd' (checked out at /assorted/jsdoc-tsd)
 * 
 * Run following to generate:
 *  - cwd: /Users/matt/dev/partridge/assorted/jsdoc-tsd
 *  - cmd: ./node_modules/.bin/jsdoc -t src-out -r ../../partridge/node_modules/razzle-dev-utils/WebpackConfigHelpers.js
 *  - view: cat out/jsdoc-results.d.ts
 * 
 * Reference:
 *  - jsdoc-tsd project - https://tinyurl.com/y6zpwu73
 */

declare class WebpackConfigHelpers {
  /**
   * WebpackConfigHelpers
   */
  constructor(filepath: string);

  /**
   * Returns wrapper around all loaders from config.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns
   */
  getLoaders(config: object): LoaderWrapper[];

  /**
   * Returns wrapper around all rules from config.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns
   */
  getRules(config: object): RuleWrapper[];

  /**
   * Returns wrapper around all plugins from config.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns
   */
  getPlugins(config: object): PluginWrapper[];

  /**
   * 
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param file - path to test against loader. Resolved relatively to $PWD.
   * @returns
   */
  getRulesByMatchingFile(config: object, file: string): RuleWrapper[];

  /**
   * Returns loaders that match provided name.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param name - name of loader.
   * @returns
   */
  getLoadersByName(config: object, name: string): LoaderWrapper[];

  /**
   * Returns plugins that match provided name.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param name - name of loader.
   * @returns
   */
  getPluginsByName(config: object, name: string): PluginWrapper[];

  /**
   * Returns plugins that match provided type.
   * @param config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param type - type of plugin.
   * @returns
   */
  getPluginsByType(config: object, type: any): PluginWrapper[];

}

/**
* Wrapper around webpack's [loader entry](https://webpack.js.org/configuration/module/#useentry).
*/
declare interface LoaderWrapper {
  /**
   * [rule entry](https://webpack.js.org/configuration/module/#module-rules).
   */
  rule: object;
  /**
   * index of rule in config.
   */
  ruleIndex: number;
  /**
   * [loader entry](https://webpack.js.org/configuration/module/#useentry).
   */
  loader: object;
  /**
   * index of loader in rule.
   */
  loaderIndex: number;
}

/**
* Wrapper around webpack's [rule](https://webpack.js.org/configuration/module/#module-rules).
*/
declare interface RuleWrapper {
  /**
   * [rule entry](https://webpack.js.org/configuration/module/#module-rules).
   */
  rule: object;
  /**
   * index of rule in config.
   */
  index: number;
}

/**
* Wrapper around webpack's [plugin](https://webpack.js.org/configuration/plugins/#plugins).
*/
declare interface PluginWrapper {
  /**
   * [plugin entry](https://webpack.js.org/configuration/plugins/#plugins).
   */
  plugin: object;
  /**
   * index of plugin in config.
   */
  index: number;
}


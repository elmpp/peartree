
/**
 *  - webpack-bundle-analyzer - https://tinyurl.com/yy4jveaq
 */
declare module "webpack-bundle-analyzer" {
  interface BundleAnalyzer {
    new (args: Args): any
  }
  export var BundleAnalyzerPlugin: BundleAnalyzer
}
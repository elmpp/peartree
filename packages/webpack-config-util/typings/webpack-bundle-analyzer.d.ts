/**
 *  - webpack-bundle-analyzer - https://tinyurl.com/yy4jveaq
 */
declare module 'webpack-bundle-analyzer' {
  interface BundleAnalyzer {
    new (args: any): any
  }
  export const BundleAnalyzerPlugin: BundleAnalyzer
}

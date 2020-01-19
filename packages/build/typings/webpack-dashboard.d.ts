
/**
 *  - webpack-dashboard - https://tinyurl.com/y3dmcxbs
 */
declare module "webpack-dashboard/plugin" {
  interface DashboardPlugin {
    new (args?: Args): any
  }
  var defaultVar: DashboardPlugin
  export default defaultVar
}
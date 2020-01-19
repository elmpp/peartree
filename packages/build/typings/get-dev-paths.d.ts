
declare module "get-dev-paths" {
  type GetDevPaths = (dir: string) => string[]

  var getDevPaths: GetDevPaths

  export default getDevPaths
}
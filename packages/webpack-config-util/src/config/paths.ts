'use strict'

import path from 'path'
import fs from 'fs'
import url from 'url'

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath)

const envPublicUrl = process.env.PUBLIC_URL

function ensureSlash(path: string, needsSlash: boolean) {
  const hasSlash = path.endsWith('/')
  if (hasSlash && !needsSlash) {
    return path.substr(0, path.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${path}/`
  } else {
    return path
  }
}

const getPublicUrl = (appPackageJson: string): string => envPublicUrl || require(appPackageJson).homepage

function getServedPath(appPackageJson: string) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl!, true)
}

const resolveOwn = (relativePath: string) => path.resolve(__dirname, '..', relativePath)

// const nodePaths = (process.env.NODE_PATH || '')
//   .split(process.platform === 'win32' ? ';' : ':')
//   .filter(Boolean)
//   .filter(folder => !path.isAbsolute(folder))
//   .map(resolveApp);

export const paths = {
  appBabelRc: [resolveApp('.babelrc'), resolveApp('babel.config.js')],
  appConfig: resolveApp('webpack.config.js'), // use .js files as ts-node isn't an option
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  appManifest: resolveApp('build/assets.json'),
  appServerEntrypoint: resolveApp('src'),
  ownNodeModules: resolveOwn('node_modules'),

  // dotenv: resolveApp('.env'),
  // appBuildPublic: resolveApp('build/public'),
  // appPublic: resolveApp('public'),
  // appClientIndexJs: resolveApp('src/client'),
  // tsTestsSetup: resolveApp('src/setupTests.ts'),
  // jsTestsSetup: resolveApp('src/setupTests.js'),
  // nodePaths: nodePaths,
  // ownPath: resolveOwn('.'),
}

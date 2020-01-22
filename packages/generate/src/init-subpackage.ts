/**
 * Adds a simple root level folder to an existing package with a small package.json
 *
 *  - inquirer choices - https://tinyurl.com/shz8bpb
 */

import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import inquirer from 'inquirer'
import findUp from 'find-up'

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path')) // eslint-disable-line @typescript-eslint/no-var-requires

interface Answers {
  directory: string
  name: string
}

export const initSubpackage = () => ({
  description: 'Scaffolds a package',
  prompts: [
    {
      type: 'fuzzypath',
      name: 'directory',
      message: 'Choose a source directory to add a subpackage for',
      // custom fields - https://tinyurl.com/y28xvl52
      excludePath: (nodePath: string) => nodePath.match('node_modules') || nodePath.match('.git'),
      excludeFilter: (nodePath: string) => nodePath.match(/\/index\.(?:js|ts)/g),
      rootPath: path.resolve(__dirname, '../../../..'),
      itemType: 'directory',
      suggestOnly: false,
    },
    {
      type: 'input',
      name: 'name',
      message: 'Subpackage name',
    },
  ],
  actions: (answers: Answers) => {
    const packageDir = getPackageDir(answers)
    const packageDetails = getPackageJson(answers, packageDir)

    return [createSubpackage(packageDir, packageDetails)]
  },
})

const createSubpackage = (packageDir: string, packageJson: object) => (answers: Answers) => {
  fs.mkdirSync(`${packageDir}/${answers.name}`, {recursive: true})
  fs.writeFileSync(`${packageDir}/${answers.name}/package.json`, JSON.stringify(packageJson, null, 1))
}

const getPackageJson = (answers: Answers, packageDir: string) => {
  const data = JSON.parse(fs.readFileSync(`${packageDir}/package.json`, 'utf8'))
  const relativeDirSrc = answers.directory.replace(packageDir, '').replace(/^\//, '')
  const relativeDirDist = relativeDirSrc.replace(/src\//, 'dist/')

  const {name, scripts, dependencies, devDependencies, ...packageJson} = data

  return _.transform<any, Dictionary<any>>(
    {
      private: true,
      main: packageJson.main && `../${relativeDirDist}/${path.basename(packageJson.main)}`,
      module: packageJson.module && `../${relativeDirDist}/${path.basename(packageJson.module)}`,
      source: packageJson.source && `../${relativeDirSrc}/${path.basename(packageJson.source)}`,
      types: packageJson.types && `../${relativeDirDist}/${path.basename(packageJson.types)}`,
    },
    (res, val, key) => {
      if (typeof val !== 'undefined') res[key] = val
    }
  )
}

const getPackageDir = (answers: Answers) => {
  const packagePath = findUp.sync('package.json', {cwd: answers.directory})
  if (!packagePath) throw new Error(`Unable to find ancestor package.json`)
  return path.dirname(packagePath)
}

/**
 * Scaffolds a package
 *
 *  - inquirer choices - https://tinyurl.com/shz8bpb
 */

import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import {AddManyActionConfig, CustomActionFunction} from 'plop'
import {execSync} from 'child_process'

interface Answers {
  name: string
  org: string
  jest: boolean
  published: boolean
  typescript: boolean
  transpile: boolean
  _tmp: {
    templateDir: string
    destinationDir: string
  }
}

export const initPackage = () => ({
  description: 'Scaffolds a package',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Directory name',
    },
    {
      type: 'list',
      name: 'org',
      message: 'Org',
      choices: () =>
        fs
          .readdirSync(path.resolve(__dirname, '../../../..'), {
            withFileTypes: true,
          })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name.replace(/@/, '')),
    },
    {
      type: 'list',
      name: 'packageName',
      message: 'Project name:',
      choices: (answers: Answers) => [`@${answers.org}/${answers.name}`, `${answers.name}`],
    },
    {
      type: 'confirm',
      name: 'published',
      message: 'Will project be published to npm?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Does package require typescript?',
      default: true,
    },
    {
      type: 'list',
      name: 'transpile',
      message: 'Will project be transpiled?:',
      choices: (answers: Answers) => {
        return answers.typescript
          ? [
              {
                name: 'tsc',
                value: 'ts-tsc',
              },
              {
                name: 'microbundle',
                value: 'ts-microbundle',
              },
              {
                name: 'webpack',
                value: 'ts-webpack',
              },
            ]
          : [
              {
                name: 'no transpilation',
                value: false,
              },
              {
                name: 'webpack',
                value: 'js-webpack',
              },
            ]
      },
    },
  ],
  actions: (answers: Answers) => {
    const templateDir = getTemplateDir(answers)
    const destinationDir = getDestinationDir(answers)

    return [
      {
        type: 'addMany',
        destination: destinationDir,
        base: templateDir,
        templateFiles: templateDir,
        globOptions: {expandDirectories: true, dot: true},
        verbose: true,
        skipIfExists: true,
        force: false,
        stripExtensions: ['hbs'],
        data: {
          lernaVersion: getLernaVersion(),
          // org: answers.org.replace(/@/, ''),
        },
      } as AddManyActionConfig,
      postCreate,
    ]
  },
})

/**
 *  - Sets up our typings folders in the base of the org. This symbolic link will be made
 * to the base of the monorepo which should already be a link to typescript-aliases:typings
 * This way all orgs will have their own copy of the typescript aliases when splitted
 */
const postCreate: CustomActionFunction = (answers: Answers) => {
  execSync(`yarn postinstall`, {stdio: 'inherit', cwd: getDestinationDir(answers)})
  return 'postCreate hook ran'
}

const getLernaVersion = () => {
  return '0.0.0' // independent mode
  // return require("../../../../lerna.json").version; // fixed mode
}

const getTemplateDir = (answers: Answers) => {
  const discriminators = {typescript: answers.typescript}
  const templateDirBasename = (
    _.transform(
      (discriminators as unknown) as Dictionary<boolean>,
      (acc: string[], val: boolean, key: string) => {
        if (val !== false) acc.push(key)
      },
      []
    )
      .sort((a: string, b: string) => a[0].localeCompare(b[0]))
      .join('-') || 'bare'
  ).replace(/[-]+$/, '')

  return path.resolve(__dirname, `../templates/init-package/${templateDirBasename}`)
}

const getDestinationDir = (answers: Answers) => {
  return `../../../../orgs/${answers.org}/packages/${answers.name}`
}

/**
 * Scaffolds a package
 *
 *  - inquirer choices - https://tinyurl.com/shz8bpb
 *  - custom plop actions - https://tinyurl.com/qktohtt
 */

import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import {AddManyActionConfig} from 'plop'
import {CustomActionFunction} from 'plop'
import {execSync} from 'child_process'

interface Answers {
  org: string
  splittable: boolean
}

export const initOrg = () => ({
  description: 'Scaffolds an organisation tree',
  prompts: [
    {
      type: 'input',
      name: 'org',
      message: 'Org name',
    },
    {
      type: 'confirm',
      name: 'splittable',
      message: "Will org be git subtree'd to own repo?",
      default: false,
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
          // org: answers.org.replace(/@/, ''),
        },
      } as AddManyActionConfig,
      cleanup,
      postCreate,
      git,
    ]
  },
})

/**
 *  - Sets up our typings folders in the base of the org. This symbolic link will be made
 * to the base of the monorepo which should already be a link to typescript-aliases:typings
 * This way all orgs will have their own copy of the typescript aliases when splitted
 */
const postCreate: CustomActionFunction = (_answers: Answers) => {
  execSync(`ln -s ../../typings typings`, {stdio: 'inherit', cwd: path.resolve(__dirname, '../../..')})
  return 'postCreate hook ran'
}

const cleanup: CustomActionFunction = (answers: Answers) => {
  const destinationDir = getDestinationDir(answers)
  if (!answers.splittable) {
    fs.rmdirSync(`${destinationDir}/.github`, {recursive: true})
    fs.unlinkSync(`${destinationDir}/.huskyrc.js`)
  }
  return 'cleared up'
}

const git: CustomActionFunction = (answers: Answers) => {
  if (answers.splittable) {
    execSync(
      `/usr/local/bin/git remote add -f splittable-${answers.org} git@github.com:elmpp/${answers.org}.git || true`,
      {stdio: 'inherit'}
    )
    return `added git remote splittable-${answers.org} to git@github.com:elmpp/${answers.org}.git`
  }
  return 'no git remotes added'
}

const getTemplateDir = (_answers: Answers) => {
  return path.resolve(__dirname, `../templates/init-org`)
}

const getDestinationDir = (answers: Answers) => {
  return path.resolve(__dirname, `../../../../${answers.org}`)
}

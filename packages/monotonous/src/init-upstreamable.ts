/**
 * Adds an existing git project into the repo
 */

import _ from 'lodash'
import path from 'path'
import {CustomActionFunction} from 'plop'
import {execFileSync} from 'child_process'

interface Answers {
  org: string
  remote: string
  remoteHttp: string
  branch: string
}

export const initUpstreamable = () => ({
  description: 'Imports an existing git project into the repo',
  prompts: [
    {
      type: 'input',
      name: 'org',
      message: 'Org name',
    },
    {
      type: 'input',
      name: 'remote',
      message: 'the git repository remote url',
    },
    {
      type: 'input',
      name: 'remoteHttp',
      message: 'the github homepage for the project',
    },
    {
      type: 'input',
      name: 'branch',
      message: "the branch to be init'ed",
      default: 'master',
    },
  ],
  actions: (_answers: Answers) => {
    return [checkout]
  },
})

const checkout: CustomActionFunction = (answers: Answers) => {
  const destinationDir = getDestinationDir(answers)
  execFileSync(
    'node',
    [
      path.resolve(__dirname, '../../build/dist/scripts/git/git-upstreamable-init.js'),
      answers.org,
      answers.remote,
      answers.branch,
    ],
    {cwd: path.resolve(__dirname, '../../../../..'), stdio: 'inherit'}
  )
  return `created git subproject at ${destinationDir}`
}

const getTemplateDir = (_answers: Answers) => {
  return path.resolve(__dirname, `../templates/init-upstreamable`)
}

const getDestinationDir = (answers: Answers) => {
  return path.resolve(__dirname, `../../../../${answers.org}-${answers.branch}`)
}

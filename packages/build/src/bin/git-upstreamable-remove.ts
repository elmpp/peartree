#! /usr/bin/env node
'use strict'

/**
 * Removes all trace of a git subproject
 *
 *  - git subproject doc example - https://tinyurl.com/qrn353n
 */

import {execSync, execFileSync} from 'child_process'
import fs from 'fs'
import path from 'path'
const params = process.argv.slice(2)

if (params.length !== 2) throw new Error('Params: org, branch')

const [org, branch] = params

const gitPath = '/usr/local/bin/git'
const orgsPath = `orgs`
const orgRegex = new RegExp(`^@${org}-${branch}.*$`)

const doExec = (cmd: string) => {
  try {
    console.debug(`Executing: ${cmd}`)
    execSync(cmd, {stdio: 'inherit'})
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

/**
 * Executes another script within our bin
 */
const doExecFile = (cmd: string, args = []) => {
  try {
    console.debug(`Executing: ${cmd} with args: ${JSON.stringify(args)}`)
    execFileSync('node', [path.resolve(__dirname, `${cmd}.js`)].concat(args), {stdio: 'inherit'})
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const doRemove = (anOrgWithBranchOrPR: string) => {
  const destinationPath = `orgs/@${anOrgWithBranchOrPR}`

  const cmd1 = `${gitPath} filter-branch --index-filter 'git rm --cached --ignore-unmatch -rf ${destinationPath}' --prune-empty -f HEAD`
  const cmd2 = `${gitPath} remote remove upstream-${anOrgWithBranchOrPR} || true`
  const cmd3 = `${gitPath} remote remove splittable-${anOrgWithBranchOrPR} || true`

  doExec(cmd1)
  doExec(cmd2)
  doExec(cmd3)

  fs.rmdirSync(destinationPath, {recursive: true})
  console.log(`** Empty repository at https://github.com/elmpp/${anOrgWithBranchOrPR} if required **`)
}

const getOrgs = (): string[] => {
  return fs
  .readdirSync(orgsPath, {withFileTypes: true})
  .filter((dirent: fs.Dirent) => dirent.isDirectory())
    .filter((dirent: fs.Dirent) => dirent.name.match(orgRegex))
    .map((dirent: fs.Dirent) => dirent.name)
}

;(() => {
  getOrgs().forEach(anOrg => {
    const anOrgWithBranchOrPR = anOrg.replace(/@/, '')
    doRemove(anOrgWithBranchOrPR)
  })
  doExecFile('git-clean-repo')
  process.exit(0)
})()

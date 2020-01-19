#! /usr/bin/env node
'use strict'

/**
 * When we init an org and specify as "splittable", we will add a subtree remote.
 * This will enable us to push/pull to our separate repo
 *
 *  - atlassian subtree tutorial - https://tinyurl.com/v4aqeej
 */

import { execSync } from "child_process";
const orgs = process.argv.slice(2);

if (typeof orgs === 'undefined') throw new Error('Supply org names as parameters')

const gitPath = '/usr/local/bin/git'

const doExec = (cmd: string) => {
  try {
    console.debug(`Executing: ${cmd}`)
    execSync(cmd, {stdio: 'inherit'})
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

const doSync = (org: string) => {

  const destinationPath = `orgs/@${org}`
  const upstreamRemote = `splittable-${org}`

  const cmd1 = `${gitPath} subtree push --prefix ${destinationPath} ${upstreamRemote} $(${gitPath} rev-parse --abbrev-ref HEAD)`

  doExec(cmd1)
}

;(() => {
  orgs.forEach(org => doSync(org))
  process.exit(0)
})()

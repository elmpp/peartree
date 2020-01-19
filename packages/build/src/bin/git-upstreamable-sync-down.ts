#! /usr/bin/env node
'use strict'

/**
 * Does a git pull against the original upstream repo to local git subproject
 *
 *  - atlassian subtree tutorial - https://tinyurl.com/v4aqeej
 */

import { execSync } from "child_process";
const params = process.argv.slice(2)

if (params.length !== 2) throw new Error('Params: org, branch')

const [org, branch] = params

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

const doSync = () => {

  const upstreamRemote = `upstream-${org}-${branch}`
  const destinationPath = `orgs/@${org}-${branch}`

  const cmd1 = `${gitPath} subtree pull --prefix ${destinationPath} ${upstreamRemote} ${branch} --squash`

  doExec(cmd1)
}

;(() => {
  doSync()
  process.exit(0)
})()

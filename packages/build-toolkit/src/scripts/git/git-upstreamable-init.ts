#! /usr/bin/env node
'use strict'

/**
 * Performs the creation of a "git subproject". This will essentially be an entire
 * existing repository added into a subdirectory. i.e. a project we depend
 * on and will likely contribute to "upstream"
 * The history of the imported project will not be squashed as commit history
 * will be required when opening pr
 *
 *  - atlassian subtree tutorial - https://tinyurl.com/v4aqeej
 */

import { execSync } from "child_process";
const params = process.argv.slice(2)

if (params.length !== 3) throw new Error('Params: org, remote, branch')

const [org, remote, branch] = params

const gitPath = '/usr/local/bin/git'

const doExec = (cmd: string) => {
  console.debug(`Executing: ${cmd}`)
  execSync(cmd, {stdio: 'inherit'})
}

const doSync = () => {

  const upstreamRemote = `upstream-${org}-${branch}`
  const splittableRemote = `splittable-${org}-${branch}`
  const destinationPath = `orgs/${org}-${branch}`
  const splittableRepo = `git@github.com:elmpp/${org}.git`

  try {
    const cmd1 = `${gitPath} remote add --no-tags -f ${upstreamRemote} ${remote} || true`
    const cmd2 = `${gitPath} remote add --no-tags -f ${splittableRemote} ${splittableRepo} || true`
    const cmd3 = `${gitPath} subtree add --prefix ${destinationPath} ${splittableRemote} ${branch}`
    const cmd4 = `${gitPath} push -f`

    doExec(cmd1)
    doExec(cmd2)
    doExec(cmd3)
    doExec(cmd4)
  } catch (err) {
    doExec(`${gitPath} remote remove ${splittableRemote} || true`)
    console.error(err.message)
    process.exit(1)
  }
}

;(() => {
  console.log('** Please ensure you have forked the project already **')
  doSync()
  process.exit(0)
})()

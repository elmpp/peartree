#! /usr/bin/env node
'use strict'

/**
 * Performs the creation of a pull request against an upstream project.
 * This will be a fork of an existing subtree instance we have locally
 *
 * Strategy - git subtree push the branch to its upstream and use that remote branch
 * as the origin for a subsequent subtree add. In essence we'll have 2 subtrees
 * of the forked project (with full histories for both)
 *
 *  - atlassian subtree tutorial - https://tinyurl.com/v4aqeej
 *  - github PR create docs - https://tinyurl.com/tu6wnac
 */

import {execSync} from 'child_process'
const params = process.argv.slice(2)

if (params.length !== 3) throw new Error('Params: org, branch, prName')

const [org, branch, prName] = params

const gitPath = '/usr/local/bin/git'

const doExec = (cmd: string) => {
  console.debug(`Executing: ${cmd}`)
  execSync(cmd, {stdio: 'inherit', env: {HUSKY_SKIP_HOOKS: '1'}} as any)
}

const doSync = () => {
  const sourceSplittableRemote = `splittable-${org}-${branch}`
  const sourcePath = `orgs/${org}-${branch}`
  const splittableRepoHttp = `https://github.com/elmpp/${org}/compare/${branch}...elmpp:${prName}`

  try {
    if (prName.match(/-/)) throw new Error('Camelcase pr names please')

    const cmd1 = `${gitPath} subtree push --prefix ${sourcePath} ${sourceSplittableRemote} ${prName}`
    doExec(cmd1)

    console.log(`** FOLLOW URL TO OPEN PR AGAINST PARENT REPO - ${splittableRepoHttp} **`)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}
;(() => {
  doSync()
  process.exit(0)
})()

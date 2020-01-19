#! /usr/bin/env node
'use strict'

/**
 * After pushing a pr to out splitted repo as a branch and perhaps
 * continue making changes we'll need to revisit that branch
 * to make amendments (e.g. update a PR following feedback)
 *
 * It is advisable to return to the main branch (e.g. master) following these
 * updates
 *
 *  - atlassian subtree tutorial - https://tinyurl.com/v4aqeej
 *  - github PR create docs - https://tinyurl.com/tu6wnac
 */

import {execSync} from 'child_process'
import fs from 'fs-extra'
import path from 'path'
const params = process.argv.slice(2)

if (params.length !== 3) throw new Error('Params: org, branch, tagName')

const [org, branch, tagName] = params

const gitPath = '/usr/local/bin/git'

const doExec = (cmd: string) => {
  console.debug(`Executing: ${cmd}`)
  execSync(cmd, {stdio: 'inherit', env: {EDITOR: '/usr/bin/vim', HUSKY_SKIP_HOOKS: '1'} as any})
}

const doSync = () => {
  const sourceSplittableRemote = `splittable-${org}-${branch}`
  const sourcePath = `orgs/@${org}-${branch}`

  try {
    if (tagName.match(/-/)) throw new Error('Camelcase pr names please')

    const cmd1 = `${gitPath} subtree pull --prefix ${sourcePath} ${sourceSplittableRemote} ${tagName}`

    doExec(cmd1)

    console.log(`** Remember to run this again soon with tagName: ${branch} **`)
  } catch (err) {
    console.error(err.message)

    // doExec(`${gitPath} reset --hard HEAD^`)
    fs.unlink(path.resolve(__dirname, '.git/MERGE_HEAD'))
    process.exit(1)
  }
}

;(() => {
  doSync()
  process.exit(0)
})()

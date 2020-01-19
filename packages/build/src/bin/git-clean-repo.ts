#! /usr/bin/env node
'use strict'

/**
 * Removes all commits not in the author list below
 */

import { execSync } from "child_process";

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

const deleteCommits = (email: string) => {

  const cmd1 = `${gitPath} filter-branch -f --commit-filter '
  if [ "$GIT_AUTHOR_EMAIL" = "${email}" ];
  then
    git commit-tree "$@";
  else
    skip_commit "$@";
  fi' HEAD`

  doExec(cmd1)
}

const deleteTags = (email: string) => {

  const cmd1 = `git for-each-ref --shell --format='%(taggeremail) %(tag)' refs/tags/$(TAG) | \
  while read entry;
  do
    EMAIL=$(echo $entry | awk '{print $1}')
    TAG=$(echo $entry | awk '{print $2}')
    if [ "$EMAIL" != "'${email}'" ]; then
      echo "deleting tag $TAG (taggeremail: $EMAIL)"
      git tag -d "$\{TAG//\\'/\}"
    else
      echo "not deleting tag $TAG (taggeremail: $EMAIL)"
    fi
  done`

  doExec(cmd1)
}

;(() => {
  deleteCommits('matthew.penrice@gmail.com')
  deleteTags('<matthew.penrice@gmail.com>')
  doExec(`${gitPath} push -f`)
  process.exit(0)
})()

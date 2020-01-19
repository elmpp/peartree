/**
 * Defines a simple generator
 *
 * Running directory through CLI:
 * `npx plop directory-index -- --directory=/Users/matt/dev/partridge/partridge/packages/partridge-client-components/assets/__generated__/img`
 *
 *  - plop docs - https://tinyurl.com/y2phrzsg
 *  - inquirer prompt types - https://tinyurl.com/yaewkyku
 */

import fs from 'fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import path from 'path'
import {CustomActionFunction, AddActionConfig} from 'plop'
const fuzzy = require('inquirer-fuzzy-path') // eslint-disable-line @typescript-eslint/no-var-requires

inquirer.registerPrompt('fuzzypath', fuzzy)

export const directoryIndex = () => ({
  description: 'traverses a directory of files and produces an index file',
  prompts: [
    {
      type: 'fuzzypath',
      name: 'directory',
      message: 'Choose a directory to add index.js for',
      // custom fields - https://tinyurl.com/y28xvl52
      // excludePath: (nodePath: string) => nodePath.match('node_modules'),
      rootPath: '/Users',
      // rootPath: path.resolve(__dirname, '../../../../../../..'),
      itemType: 'directory',
      suggestOnly: false,
      // depthLimit: 3,
    },
  ],
  actions: [
    findFiles,
    // doTemplating(plop),
    {
      type: 'add',
      templateFile: path.resolve(__dirname, '../templates/directory-index/template-index.hbs'),
      path: '{{directory}}/index.js',
      // data: answers.findFiles,
      force: true,
      // skipIfExists: false,
      // abortOnFail: true,
    } as AddActionConfig,
  ],
})

/**
 * Plop custom action example
 *
 *  - docs - https://tinyurl.com/y49qq9z9
 *  - code - https://tinyurl.com/yy33ea24
 */
const findFiles: CustomActionFunction = (answers: any) => {
  const files = fs.readdirSync(answers.directory).filter(filename => !filename.startsWith('.'))

  // we'll just stick the files it onto the answers
  answers.files = files

  return `found ${files.length} files`
}

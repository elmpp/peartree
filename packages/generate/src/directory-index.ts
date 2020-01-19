/**
 * Defines a simple generator
 *
 * Running directory through CLI:
 * `npx plop directory-index -- --directory=/Users/matt/dev/partridge/partridge/packages/partridge-client-components/assets/__generated__/img`
 *
 *  - plop docs - https://tinyurl.com/y2phrzsg
 *  - inquirer prompt types - https://tinyurl.com/yaewkyku
 *  - fuzzypath - https://tinyurl.com/y28xvl52
 */

import fs from 'fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import path from 'path'
import {CustomActionFunction, AddActionConfig} from 'plop'

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path')) // eslint-disable-line @typescript-eslint/no-var-requires

const extensions = ['ts', 'js'] as const
interface Answers {
  directory: string
  extension: typeof extensions
  named: boolean
}

export const directoryIndex = () => ({
  description: 'traverses a directory of files and produces an index file',
  prompts: [
    {
      type: 'fuzzypath',
      name: 'directory',
      message: 'Choose a directory to add index.js for',
      // custom fields - https://tinyurl.com/y28xvl52
      excludePath: (nodePath: string) => nodePath.match('node_modules') || nodePath.match('.git'),
      excludeFilter: (nodePath: string) => nodePath.match(/\/index\.(?:js|ts)/g),
      rootPath: path.resolve(__dirname, '../../../..'),
      itemType: 'directory',
      suggestOnly: false,
      // depthLimit: 3,
    },
    {
      type: 'list',
      name: 'extension',
      message: 'js or ts',
      choices: extensions,
    },
    {
      type: 'confirm',
      name: 'named',
      message: 'Are imports named (i.e. not default)',
    },
  ],
  actions: (answers: Answers) => {
    return [
      findFiles,
      {
        type: 'add',
        templateFile: path.resolve(__dirname, `../templates/directory-index/template-index.${answers.extension}.hbs`),
        path: `{{directory}}/index.${answers.extension}`,
        // data: answers.findFiles,
        force: true,
        // skipIfExists: false,
        // abortOnFail: true,
      } as AddActionConfig,
    ]
  },
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

# webpack-config-utils

<!-- ## Table of Contents
+ [Problem](#problem)
+ [Getting Started](#solution)
+ [Installation](#installation)
+ [Usage](#usage)
+ [Options](#options)
+ [Plugins](#plugins)
+ [Contributing](../CONTRIBUTING.md) -->

## The Problem <a name = "problem"></a>

Declarative configuration is great but the learning cost is high for the majority of folk. Sometimes
you just want to create a webpack config with a few options and then sprinkle on a few settings.

## This Solution <a name = "solution"></a>

Webpack config util offers 2 methods to create the perfect config:

#### 🛠 Create Config:

We expose a function `createConfig` which is what you'll need to create a ready-to-go config.

Its options are intuitive yet support a wide range of scenarios including node/web, dev servers or even logging of emitted bundle sizes

Full list of [options here](#options)

#### 🩹 Plugins:

A grab bag of imperative "plugins" that understand the config
they're operating on. Just stack them up and tailor for your use case

We have found for our projects this really helps with auditing what it is we want our
bundler to actually do for us. It's far too easy for codebases and bundler configs to get
out of sync

The plugins are also compatible with [next plugins](https://github.com/zeit/next-plugins) although tend to be a little lower level


## Installation <a name = "installation"></a>

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with node and should be installed as one of your project's devDependencies:

```bash
yarn add -D @peartree/webpack-config-util
```

## Usage <a name = "installation"></a>

> This example uses [typescript configuration](https://webpack.js.org/guides/typescript/) but feel free to use a `webpack.config.js` file

```typescript
// webpack.config.ts
import {plugins, getDevPackagesPaths, compose, createConfig} from '@peartree/webpack-config-util'

const composedPlugins = compose(
  plugins.mainFields(['ts', 'tsx', 'js']),
  plugins.whitelistAllPackages(),
)

const config = composedPlugins(createConfig({}))

export default config
```

This will output the full webpack config. Debug here or apply the [debug plugin](#plugin-debug-config)

## Options <a name = "options"></a>

| parameter     | web/node | default |  type  | description                                                                                                                                                                     |
|-------|----|-------------------------------------------|:---:|---:|
|     nodeBundle   | node  | *required* | string | the name of the bundle file |
|     buildDir   | node  | *required* | string | where the bundle will be output to |
|     host   | node  | localhost | string | where the bundle will be output to |
|     port   | node  | 3000 | number | where the bundle will be output to |
|     serverEntryPoint   | web & node  | (src/)index.js | string | [entry point](https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax) relative to ./src directory |
|     hotModuleReplacement   | web  | true | boolean | whether to apply the hot [module replacement plugin](https://webpack.js.org/concepts/hot-module-replacement/#root) |
|     mode   | web & node  | *required* | 'development' or 'production' | defines whether webpack will operate in dev [mode](https://webpack.js.org/configuration/mode/#root). Note this is distinct from NODE_ENV |
|     target   | web & node  | *required* | 'web' or 'node' | defines the target platform [target](https://webpack.js.org/concepts/targets/#root) |

## Plugins <a name = "plugins"></a>

TBD. You can check them all [here](https://github.com/elmpp/peartree/tree/master/packages/webpack-config-util/src/plugins)


## Contributing <a name = "contributing"></a>

This package is part of a monorepo. Please see [here](https://github.com/elmpp/{{org}}) for details of how to contribute.

The project follows the all-contributors specification. Contributions of any kind welcome!
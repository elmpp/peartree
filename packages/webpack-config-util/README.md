# Webpack Config Util

## Table of Contents
+ [Problem](#problem)
+ [Getting Started](#solution)
+ [Installation](#installation)
+ [Usage](#usage)
+ [Options](#options)
+ [Plugins](#plugins)
+ [Contributing](../CONTRIBUTING.md)

## The Problem <a name = "problem"></a>

Declarative configuration is great but the learning cost is high for the majority of folk. Sometimes
you just want to create a webpack config with a few options and then sprinkle on a few settings.

## This Solution <a name = "solution"></a>

Webpack config util offers 2 methods to create the perfect config:

#### Create Config:

We expose a function `createConfig` which is what you'll need to create a ready-to-go config.

Its options are intuitive yet support a wide range of scenarios including node/web, dev servers or even logging of emitted bundle sizes

Full list of [options here](#options)

#### Plugins:

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

```typescript
// webpack.config.js
import {plugins, getDevPackagesPaths, compose, createConfig} from '@peartree/webpack-config-util'

const composedPlugins = compose(
  plugins.mainFields(['ts', 'tsx', 'js']),
  plugins.whitelistAllPackages(),
)

const config = composedPlugins(createConfig({}))

export default config
```

This will output the full webpack config. Debug here or apply the [debug plugin](#plugin-debug-config)

## 🛠 Options <a name = "options"></a>


## 🩹 Plugins <a name = "plugins"></a>
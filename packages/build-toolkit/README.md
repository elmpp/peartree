# Build Toolkit

## Table of Contents
+ [Problem](#problem)
+ [Getting Started](#solution)
+ [Installation](#installation)
+ [Contributing](../CONTRIBUTING.md)

## The Problem <a name = "problem"></a>

Declarative configuration is great but the learning cost is high for the majority of folk. Sometimes
you just want to take a config and sprinkle on a few settings. This is especially true when
you may be using several bundlers for the same codebase (e.g. web/mobile)

## This Solution <a name = "solution"></a>

Bundler config util offers a grab bag of imperative "plugins" that understand the config
they're operating on. Just stack them up and get a perfect config out the other end

We have found for our projects this really helps with auditing what it is we want our
bundler to actually do for us. It's far too easy for codebases and bundler configs to get
out of sync


## Installation <a name = "installation"></a>

```bash
yarn add -D @peartree/webpack-config-util
```

```
// webpack.config.js
const {mainFields} = require('@peartree/webpack-config-util')

module.exports =
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo.

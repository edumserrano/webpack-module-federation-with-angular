# Basics of webpack module federation

- [Description](#description)
- [Webpack configuration file](#webpack-configuration-file)
  - [Example webpack configuration file for a remote app](#example-webpack-configuration-file-for-a-remote-app)
  - [Example webpack configuration file for a host/shell app](#example-webpack-configuration-file-for-a-hostshell-app)
  - [Explaining the webpack configuration values](#explaining-the-webpack-configuration-values)
- [How the loading of an external webpack module works](#how-the-loading-of-an-external-webpack-module-works)

## Description

This document aims to clarify how webpack module federation allows exposing and consuming webpack modules at runtime. Check out the official webpack docs for a better understanding of the terms used:
- [What is a webpack Module](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)

> **Note**
> 
> Although there are references to angular in this documention, the majority of the information here is agnostic to the frontend technology used. It's valid as long as you're using Webpack.
>

## Webpack configuration file

The below shows an example of the **minimum** configuration required to get webpack module federation working for **angular apps**. For more information see:

- [webpack official documentation](https://webpack.js.org/configuration/)
- [gist with Module Federation options, usage, hints](https://gist.github.com/zfeher/201f55c057553078fe5b0aac1dad6969)
- [ModuleFederationPlugin schema](https://github.com/webpack/webpack/blob/main/schemas/plugins/container/ModuleFederationPlugin.json)

> **Note**
> 
> When using angular, the example webpack configuration files below can be further simplified by using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package. See the [angular-architects-ng16](/angular-architects-ng16/README.md) example and look at the `webpack.config.js` files for the remote and shell apps. 
>
> The `@angular-architects/module-federation` package streamlines the webpack configuration by providing functions that set several of the webpack configuration values shown below. 
>

### Example webpack configuration file for a remote app

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe1",
      exposes: {
        "./my-feature-module": "./src/app/my-feature/my-feature.module.ts"
      },
      library: { type: "module" },
      filename: "remoteEntry.js",
      shared: [
        "@angular/core",
        "@angular/router",
        "@angular/common",
      ]
    }),
  ],
};
```

### Example webpack configuration file for a host/shell app

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },
        remotes: {
          mfe1: "http://localhost:4201/remoteEntry.js",
        },
        filename: 'remoteEntry.js',
        shared: [
          "@angular/core",
          "@angular/router",
          "@angular/common",
        ]
    }),
  ],
};
```

### Explaining the webpack configuration values

Let's start by looking at:

```js
output: {
    publicPath: 'auto',
},
optimization: {
    runtimeChunk: false,
},
experiments: {
    outputModule: true,
},
```

- [output.publicPath](https://webpack.js.org/configuration/output/#outputpublicpath): you will likely always have this on `auto` which in short points to wherever the app is being served from.
- [optimization.runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk): for **angular apps** at least this should always be disabled. If enabled it will cause the module federation solution to break, which is related to a bug. I couldn't find which bug but I when I tried to turn on for the shell app, it stopped working. The angular app just didn't get rendered and no errors on console were visible.
- [experiments.outputModule](https://webpack.js.org/configuration/experiments/#experimentsoutputmodule): when enabled, webpack will output ECMAScript module syntax whenever possible.

Now let's take a look at the configuration values for the `ModuleFederationPlugin` plugin. Some of these are usually only used on the remote app and some are only used on the shell app:

- `name`: the name of the container.
- `filename`: the filename of the container as relative path inside the `output.path`.
- `library: { type: "module" }`: the type of library. Types included by default are 'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'commonjs-static', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins. If not specified it defaults to `{ type: "var", name: containerName }` where `containerName` will be the `ModuleFederationPlugin.name`.
- `exposes`: webpack modules that should be exposed by this container. The key is the name of the webpack module and the value is the file that it maps to.
- `remotes`: container locations and request scopes from which modules should be resolved and loaded at runtime. In this array of key-value types, the key represents the name that will be used to import the webpack module in the shell application and the value defines an external location/url where to fetch the webpack module from.
- `shared`: the shared section defines modules that are shared dependencies between the shell and the remote module.

## How the loading of an external webpack module works

Consider that the webpack configuration file for a remote app contains the following:

```js
exposes: {
  "./my-feature-module": "./src/app/my-feature/my-feature.module.ts",
  ...
},
filename: "remoteEntry.js",
```

And that the webpack configuration file for a shell app contains the following:

```js
remotes: {
  mfe1: "http://localhost:4201/remoteEntry.js",
  ...
},
```

To load the webpack module from the remote app into the shell app we need to import the webpack module from `mfe1/my-feature-module`, where `mfe1` is the name of one of the remotes available to the shell app and `my-feature-module` is the name of one of the webpack modules that is exposed by the remote.

The following import statement loads the external webpack module from `http://localhost:4201/remoteEntry.js` into the shell app.

```js
import('mfe1/my-feature-module')
```

Once the `import` function completes we can access whatever is exposed in that webpack module. In this example, the remote app is exposing an angular module named `MyFeatureModule` defined in the file `./src/app/my-feature/my-feature.module.ts`. This means that we can access it by doing the following:

```js
import('mfe1/my-feature-module').then((m) => m.MyFeatureModule);
```

In this example we loaded an angular module because that is what the remote was exposing but the remote can expose anything, such as simple functions.

> **Note**
> 
> You can see all this implemented in an angular app on the [basic-ng16](/basic-ng16/README.md) example.
>

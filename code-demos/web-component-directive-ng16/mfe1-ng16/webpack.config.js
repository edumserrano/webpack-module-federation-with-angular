const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

const moduleFederationConfig = withModuleFederationPlugin({
  name: "mfe1-ng16",
  filename: "remoteEntry.js", // this doesn't need to be set, if not specified it defaults to remoteEntry.js. Setting it here just for demo purposes.
  exposes: {
    "./standalone-component-as-web-component": "./src/app/my-standalone-component/remote-bootstrap.ts",
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
// moduleFederationConfig.experiments.topLevelAwait = true;

const webpackConfig = {
  ...moduleFederationConfig,
  experiments: {
    ...moduleFederationConfig.experiments,
    topLevelAwait: true,
  },
}

module.exports = webpackConfig;

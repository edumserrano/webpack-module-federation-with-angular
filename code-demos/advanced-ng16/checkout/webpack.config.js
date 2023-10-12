const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

const moduleFederationConfig = withModuleFederationPlugin({
  name: "checkout",
  filename: "remoteEntry.js", // this doesn't need to be set, if not specified it defaults to remoteEntry.js. Setting it here just for demo purposes.
  exposes: {
    "./checkout": "./src/app/checkout/remote-bootstrap.ts",
    "./checkout-auto": "./src/app/checkout/remote-bootstrap-auto.ts",
 },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});

const webpackConfig = {
  ...moduleFederationConfig,
  experiments: {
    ...moduleFederationConfig.experiments,
    topLevelAwait: true,
  },
}

module.exports = webpackConfig;

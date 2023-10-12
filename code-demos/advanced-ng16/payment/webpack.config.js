const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

const moduleFederationConfig = withModuleFederationPlugin({
  name: "payment",
  filename: "remoteEntry.js", // this doesn't need to be set, if not specified it defaults to remoteEntry.js. Setting it here just for demo purposes.
  exposes: {
    "./payment": "./src/app/payment/payment.component.ts",
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

const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "mfe1-ng16",
  filename: "remoteEntry.js", // this doesn't need to be set, if not specified it defaults to remoteEntry.js. Setting it here just for demo purposes.
  exposes: {
    "./my-standalone-component": "./src/app/my-standalone-component/my-standalone-component.component.ts",
  },
  shared: {
    ...shareAll({
      singleton: false,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});

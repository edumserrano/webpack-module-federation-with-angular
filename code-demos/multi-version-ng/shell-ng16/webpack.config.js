const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  remotes: {
    // no need to declare remotes as they are dynamically loaded.
  },
  shared: {
    ...shareAll({
      singleton: false,
      strictVersion: false,
      requiredVersion: "auto",
    }),
  },
});

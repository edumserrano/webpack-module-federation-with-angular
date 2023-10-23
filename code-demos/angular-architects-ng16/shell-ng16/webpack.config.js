const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

const webpackConfig = withModuleFederationPlugin({
  remotes: {
    mfe1: "http://localhost:4201/remoteEntry.js",
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
module.exports = webpackConfig;

// The lines below are NOT needed. They are just here to make it easier to understand
// what webpack configuration values the `withModuleFederationPlugin` function is
// setting up.
//
// These logs will show up when you run `npm start` for the shell-ng16 app
console.log("\n\n==========WEBPACK ROOT LEVEL CONFIG==========")
console.log(webpackConfig);
console.log("==========WEBPACK ROOT LEVEL CONFIG==========")

console.log("\n\n==========WEBPACK ModuleFederationPlugin CONFIG==========")
console.log(webpackConfig.plugins[0]);
console.log("==========WEBPACK ModuleFederationPlugin CONFIG==========")

console.log("\n\n==========WEBPACK FULL CONFIG==========")
console.log(JSON.stringify(webpackConfig, null, 2));
console.log("==========WEBPACK FULL CONFIG==========\n\n")


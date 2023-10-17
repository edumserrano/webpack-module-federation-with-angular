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

// Besides setting module federation options, we also need to set
// the `experiments.topLevelAwait` to true because we're using
// a top level `await` instruction at src/app/checkout/remote-bootstrap-auto.ts
// See https://webpack.js.org/configuration/experiments/#experimentstoplevelawait
//
// The simplest way to do it would be with the single line like this:
// moduleFederationConfig.experiments.topLevelAwait = true;
// module.exports = moduleFederationConfig;
//
// However, I'm using the spread operator below to show how extending JS objects can
// be done. This syntax would be more useful if we wanted to extend the object
// in a more complex way, such as by adding several other properties/objects.
//
const webpackConfig = {
  ...moduleFederationConfig,
  experiments: {
    ...moduleFederationConfig.experiments,
    topLevelAwait: true,
  },
}

module.exports = webpackConfig;

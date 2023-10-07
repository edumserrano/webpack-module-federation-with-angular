const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "tsconfig.json"), [
  /* mapped paths to share */
]);

module.exports = {
  output: {
    uniqueName: "mfe3",
    publicPath: "auto",
    scriptType: "text/javascript",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe3",
      exposes: {
        "./remote-bootstrap": "./src/mfe-platform/remote-bootstrap.ts",
      },
      library: { type: "var", name: "mfe3" },
      filename: "remoteEntry.js",
      shared: share({
        "@angular/core": {
          singleton: false,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/common": {
          singleton: false,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          singleton: false,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/router": {
          singleton: false,
          strictVersion: false,
          requiredVersion: "auto",
        },

        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};

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
    uniqueName: "mfe2",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe2",
      library: { type: "module" },
      filename: "remoteEntry.js",
      exposes: {
        "./remote-bootstrap": "./src/app/my-feature/remote-bootstrap.ts",
      },
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

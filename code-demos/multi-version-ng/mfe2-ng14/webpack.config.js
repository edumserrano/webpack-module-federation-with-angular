const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const shareAll = mf.shareAll;

// In this version of the @angular-architects/module-federation lib, you register
// the lib name with the SharedMappings instance.
//
// Beginning with version 1.2, the boilerplate for using SharedMappings is generated for you.
// See https://www.npmjs.com/package/@angular-architects/module-federation#legacy-syntax-and-version-12-13
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

      // Could also use the shareAll function from @angular-architects/module-federation
      // to set the ModuleFederationPlugin.shared object.
      // The shareAll function shares all the dependencies from the package.json file.
      //
      // Comment the above shared block and uncomment the below one to test it.
      //
      // shared: {
      //   ...shareAll({
      //     singleton: true,
      //     strictVersion: false,
      //     requiredVersion: "auto",
      //   }),
      //   // ...sharedMappings.getDescriptors(),
      // },
    }),
    sharedMappings.getPlugin(),
  ],
};

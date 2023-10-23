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
    uniqueName: "mfe4",
    publicPath: "auto",
    scriptType: "text/javascript",
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe4",
      exposes: {
        "./my-component": "./src/app/my-feature/my-component/my-component.component.ts",
      },
      library: { type: "var", name: "mfe4" },
      filename: "remoteEntry.js",
      shared: share({
        "@angular/core": {
          singleton: true,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/common": {
          singleton: true,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: false,
          requiredVersion: "auto",
        },
        "@angular/router": {
          singleton: true,
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
  ],
};

const { share, shareAll } = require("@angular-architects/module-federation/webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

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
      }),
      // shared: ["@angular/core", "@angular/router", "@angular/common"],
      // shared: {
      //   "@angular/core": {
      //     singleton: true
      //   },
      //   "@angular/router": {
      //     singleton: true
      //   },
      //   "@angular/common": {
      //     singleton: true
      //   }
      // },
      // shared: {
      //   ...shareAll({
      //     singleton: true,
      //     strictVersion: true,
      //     requiredVersion: "auto",
      //   }),
      // },
    }),
  ],
};

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe1",
      exposes: {
        "./my-feature-module": "./src/app/my-feature/my-feature.module.ts"
      },
      library: { type: "module" },
      filename: "remoteEntry.js",
      shared: [
        "@angular/core",
        "@angular/router",
        "@angular/common",
      ]
    }),
  ],
};

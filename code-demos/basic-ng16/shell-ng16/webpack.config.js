const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },
        remotes: {
          mfe1: "http://localhost:4201/remoteEntry.js",
        },
        filename: 'remoteEntry.js',
        shared: [
          "@angular/core",
          "@angular/router",
          "@angular/common",
        ]
    }),
  ],
};

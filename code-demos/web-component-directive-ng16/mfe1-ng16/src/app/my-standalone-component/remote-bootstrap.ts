import { bootstrapMyComponentAsync } from './my-standalone-component-bootstrap';

// The webpack configuration file at /web-component-directive-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this file. So when the webpack module is loaded,
// this function is executed.
//
// Also note that this file is using a top level await and requires the
// `experiments.topLevelAwait` webpack config to be set to true.
// See https://webpack.js.org/configuration/experiments/#experimentstoplevelawait
//
await bootstrapMyComponentAsync();

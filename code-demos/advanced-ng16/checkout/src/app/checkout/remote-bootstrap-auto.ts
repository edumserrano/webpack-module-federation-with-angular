import { mountAsync } from "./remote-bootstrap";

// The webpack configuration file at /advanced-ng16/checkout/webpack.config.js
// exposes a webpack module which contains this file. So when the webpack module
// is loaded, this function is executed.
//
// Also note that this file is using a top level await and requires the
// `experiments.topLevelAwait` webpack config to be set to true.
// See https://webpack.js.org/configuration/experiments/#experimentstoplevelawait
//
await mountAsync("mfe-checkout");


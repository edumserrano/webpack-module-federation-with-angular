import { bootstrapMyComponentAsync } from './my-standalone-component-bootstrap';

// The webpack configuration file at /web-component-angular-architects-wrapper-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this file. So when the webpack module is loaded,
// this function is executed.
await bootstrapMyComponentAsync();

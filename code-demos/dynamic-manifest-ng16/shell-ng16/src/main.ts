import { initFederation } from '@angular-architects/module-federation';

// Sharing modules requires that all remotes are initialized
// and can provide shared modules to the common scope
// As this is an async operation we need an async boundary (import())

// Using modules from remotes is also an async operation
// as chunks need to be loaded for the code of the remote module
// This also requires an async boundary (import())
// At this point shared modules initialized and remote modules are loaded
//
// It's possible to place more code here to do stuff on page init
// but it can't use any of the shared modules or remote modules.

// The manifest file contains information about the remotes, so we must load
// it first, before we call the code at /src/bootstrap.ts which will start the
// Angular app. Note that the `import('./bootstrap')` is the async boundary
// mentioned in the paragraph above.
//
// The data from the manifest file is then used on the app routes at
// /src/app/app-routing.module.ts.
initFederation('/assets/mf.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));

import { initFederation } from '@angular-architects/module-federation';

// The manifest file contains information about the remotes, so we must load
// it first, before we call the code at /src/bootstrap.ts which will start the
// Angular app.
//
// The data from the manifest file is then used on the app routes at
// /src/app/app-routing.module.ts.
initFederation('/assets/mf.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));

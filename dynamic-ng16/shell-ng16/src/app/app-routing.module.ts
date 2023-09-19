import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'mfe1-dynamic',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './my-feature-module',
      })
        .then((m) => m.MyFeatureModule)
        .catch((err) => console.error('Error lazy loading mfe1 for mfe1-dynamic path', err)),
  },
  {
    path: 'mfe1-manifest',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfe1',
        exposedModule: './my-feature-module',
      })
        .then((m) => m.MyFeatureModule)
        .catch((err) => console.error('Error lazy loading mfe1 for mfe1-manifest path', err)),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

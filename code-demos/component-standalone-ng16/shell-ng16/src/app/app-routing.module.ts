import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-standalone-component',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './my-standalone-component',
      })
        .then((m) => m.MyStandaloneComponent)
        .catch((err) =>
          console.error('Error lazy loading my-standalone-component', err)
        ),
  },
  {
    path: 'another-standalone-component',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './another-standalone-component',
      })
        .then((m) => m.AnotherStandaloneComponent)
        .catch((err) =>
          console.error('Error lazy loading another-standalone-component', err)
        ),
  },
  {
    path: 'standalone',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './standalone-routes',
      })
        .then((m) => m.STANDALONE_COMPONENTS_ROUTES)
        .catch((err) =>
          console.error('Error lazy loading standalone-routes', err)
        ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

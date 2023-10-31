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
    data: {
      // This works as a way to pass input to the component because the bindToComponentInputs option is set to true below
      // For more info see:
      // - https://angular.io/api/router/ExtraOptions
      // - https://angularindepth.com/posts/1519/router-data-as-components-inputs-in-angular-v16
      // - https://www.freecodecamp.org/news/use-input-for-angular-route-parameters/
      // - https://itnext.io/bind-route-info-to-component-inputs-new-router-feature-1d747e559dc4
      inputText: 'Hello from the shell!',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

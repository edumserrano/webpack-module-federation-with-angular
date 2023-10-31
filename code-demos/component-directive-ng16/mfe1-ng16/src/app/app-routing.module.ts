import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-component',
    loadChildren: () =>
      import('./my-feature/my-feature.module')
        .then((m) => m.MyFeatureModule),
    data: {
      // This works as a way to pass input to the component because the bindToComponentInputs option is set to true below
      // For more info see:
      // - https://angular.io/api/router/ExtraOptions
      // - https://angularindepth.com/posts/1519/router-data-as-components-inputs-in-angular-v16
      // - https://www.freecodecamp.org/news/use-input-for-angular-route-parameters/
      // - https://itnext.io/bind-route-info-to-component-inputs-new-router-feature-1d747e559dc4
      inputText: 'test input value from dev platform',
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

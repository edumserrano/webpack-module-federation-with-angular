import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-standalone-component',
    loadComponent: () =>
      import('./my-standalone-component/my-standalone-component.component')
        .then((m) => m.MyStandaloneComponent),
  },
  {
    path: 'another-standalone-component',
    loadComponent: () =>
      import('./another-standalone-component/another-standalone-component.component')
        .then((m) => m.AnotherStandaloneComponent),
  },
  {
    path: 'standalone',
    loadChildren: () =>
      import('./standalone-component.route')
        .then(m => m.STANDALONE_COMPONENTS_ROUTES)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

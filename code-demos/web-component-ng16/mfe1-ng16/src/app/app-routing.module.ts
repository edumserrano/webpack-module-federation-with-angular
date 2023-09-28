import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-standalone-component',
    loadComponent: () =>
      import('./my-standalone-component/my-standalone-component.component')
        .then((m) => m.MyStandaloneComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

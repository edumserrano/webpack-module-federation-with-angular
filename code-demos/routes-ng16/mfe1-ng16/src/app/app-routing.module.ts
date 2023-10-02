import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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

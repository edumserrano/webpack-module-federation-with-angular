import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyComponent } from '../app/my-component/my-component.component';

const routes: Routes = [
  {
    path: 'my-component',
    component: MyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DevPlatformRoutingModule { }

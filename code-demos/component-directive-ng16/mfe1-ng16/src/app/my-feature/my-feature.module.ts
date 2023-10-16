import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponent } from './my-component/my-component.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '**',
    component: MyComponent,
  },
];

@NgModule({
  declarations: [MyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // see https://angular.io/guide/lazy-loading-ngmodules#forroot-and-forchild
  ],
})
export class MyFeatureModule {}

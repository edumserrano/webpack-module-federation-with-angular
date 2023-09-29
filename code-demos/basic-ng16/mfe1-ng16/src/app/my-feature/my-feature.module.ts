import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponent } from './my-component/my-component.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-component',
    component: MyComponent,
  },
];

// The webpack configuration file at /basic-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this Angular feature module
@NgModule({
  declarations: [MyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // see https://angular.io/guide/lazy-loading-ngmodules#forroot-and-forchild
  ],
})
export class MyFeatureModule {}

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

@NgModule({
  declarations: [
    MyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class MyFeatureModule { }

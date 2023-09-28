import { ComponentRef, EnvironmentInjector, NgModule, createComponent } from '@angular/core';
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
  declarations: [MyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class MyFeatureModule {

  public constructor(private readonly _environmentInjector : EnvironmentInjector) { }

  public static readonly entryComponentType: typeof MyComponent = MyComponent;

  public getEntryComponent() : ComponentRef<MyComponent>
  {
    const createComponentOptions = {
      environmentInjector: this._environmentInjector,
    }
    return createComponent(MyComponent, createComponentOptions);
  }
}

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
    RouterModule.forChild(routes), // see https://angular.io/guide/lazy-loading-ngmodules#forroot-and-forchild
  ],
})
export class MyFeatureModule {

  public constructor(private readonly _environmentInjector : EnvironmentInjector) { }

  // this is used by one of the 4 methods that the shell uses to dynamically
  // instantiate the MyComponent Angular component from this mfe1 app.
  // See the `loadV2` method at /code-demos/component-ng16/shell-ng16/src/app/app.component.ts
  public static readonly entryComponentType: typeof MyComponent = MyComponent;

  // this is used by one of the 4 methods that the shell uses to dynamically
  // instantiate the MyComponent Angular component from this mfe1 app.
  // See the `loadV3` method at /code-demos/component-ng16/shell-ng16/src/app/app.component.ts
  public getEntryComponent() : ComponentRef<MyComponent>
  {
    const createComponentOptions = {
      environmentInjector: this._environmentInjector,
    }
    return createComponent(MyComponent, createComponentOptions);
  }
}

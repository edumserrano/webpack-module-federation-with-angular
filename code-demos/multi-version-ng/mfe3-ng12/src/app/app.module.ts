import { NgModule } from '@angular/core';
import { MyComponent } from './my-component/my-component.component';

// This Angular module is shared/imported by both the DevPlatformModule and the
// MfePlatformModule.
// In this code demo, this AppModule is a feature module whilst the DevPlatformModule
// and MfePlatformModule are root modules. For more info see https://angular.io/guide/feature-modules
@NgModule({
  declarations: [MyComponent],
  imports: [],
  providers: [],
  bootstrap: [],
  exports: [MyComponent],
})
export class AppModule {
}

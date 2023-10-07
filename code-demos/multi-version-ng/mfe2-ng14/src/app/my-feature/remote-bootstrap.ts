import { ApplicationRef, ElementRef } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { createApplication } from '@angular/platform-browser';
import { MyComponent } from './my-component/my-component.component';

export async function bootstrapMyComponentAsync(elementRef: ElementRef<any>): Promise<void> {
  const appConfig: ApplicationConfig = {
    providers: [], // add any required providers here
  };
  const appRef: ApplicationRef = await createApplication(appConfig);
  appRef.bootstrap(MyComponent,elementRef.nativeElement);
}

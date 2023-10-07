import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyComponent } from './my-component/my-component.component';

@NgModule({
  declarations: [MyComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [],
  exports: [MyComponent],
})
export class AppModule {
}

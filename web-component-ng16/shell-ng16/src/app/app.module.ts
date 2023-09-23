import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MyStandaloneComponentWrapper } from './my-standalone-component-wrapper/my-standalone-component.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MyStandaloneComponentWrapper],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

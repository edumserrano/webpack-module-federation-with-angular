import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoadRemoteComponentDirective } from './load-remote-component.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoadRemoteComponentDirective
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

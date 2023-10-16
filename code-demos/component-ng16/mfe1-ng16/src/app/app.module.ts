import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MyFeatureModule } from './my-feature/my-feature.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MyFeatureModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

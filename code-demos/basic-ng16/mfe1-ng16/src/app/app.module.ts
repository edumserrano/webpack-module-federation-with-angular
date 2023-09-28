import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyFeatureModule } from 'src/app/my-feature/my-feature.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, MyFeatureModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

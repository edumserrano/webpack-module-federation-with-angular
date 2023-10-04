import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModuleFederationToolsModule } from '@angular-architects/module-federation-tools';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ModuleFederationToolsModule],
  schemas: [],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

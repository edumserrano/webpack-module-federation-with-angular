import { NgModule } from '@angular/core';
import { DevPlatformRoutingModule } from './dev-platform-routing.module';
import { DevPlatformEntryComponent } from './dev-platform-entry.component';
import { AppModule } from '../app/app.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [DevPlatformEntryComponent],
  imports: [BrowserModule, AppModule, DevPlatformRoutingModule],
  providers: [],
  bootstrap: [DevPlatformEntryComponent],
})
export class DevPlatformModule {}

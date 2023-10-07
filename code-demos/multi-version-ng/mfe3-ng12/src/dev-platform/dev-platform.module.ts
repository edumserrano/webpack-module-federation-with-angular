import { NgModule } from '@angular/core';
import { DevPlatformRoutingModule } from './dev-platform-routing.module';
import { DevPlatformEntryComponent } from './dev-platform-entry.component';
import { AppModule } from '../app/app.module';

@NgModule({
  declarations: [DevPlatformEntryComponent],
  imports: [AppModule, DevPlatformRoutingModule],
  providers: [],
  bootstrap: [DevPlatformEntryComponent],
})
export class DevPlatformModule {}

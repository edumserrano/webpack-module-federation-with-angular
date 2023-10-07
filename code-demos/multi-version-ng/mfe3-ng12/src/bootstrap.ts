import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { DevPlatformModule } from './dev-platform/dev-platform.module';
import { MfePlatformModule } from './mfe-platform/mfe-platform.module';

if (environment.production) {
  enableProdMode();
}

const bootstrapModule = environment.runMfePlatform
  ? MfePlatformModule
  : DevPlatformModule;

platformBrowserDynamic()
  .bootstrapModule(bootstrapModule)
  .catch((err) => console.error(err));


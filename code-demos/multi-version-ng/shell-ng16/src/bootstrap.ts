import { PlatformRef } from '@angular/core';
import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';
import packageJson from '../package.json';

// This commented out code is the usual code to start an Angular 16 app.
// However, to allow loading a different version of Angular from the mfe apps
// we need to add a bit of extra code that makes sure that the only a version
// of Angular platform is instantiated per major version of Angular. Subsequent
// attempts to instantiate the same major version of Angular platform will instead
// retrieve it from the window.platform map.
//
// The code for this function was taken from the `Reuse Angular Platform` section of
// `Multi-Framework and -Version Micro Frontends with Module Federation: The Good, the Bad, the Ugly`
// available at:
// - https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-the-good-the-bad-the-ugly/
//
// For more information see the `What makes multi-version work` section of the README
// for this code demo.
//
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//
// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));

const platform = getAngularPlatform();
platform.bootstrapModule(AppModule);

function getAngularPlatform(): PlatformRef {
  // for the packageJson import to work we have to set `resolveJsonModule` and
  // `allowSyntheticDefaultImports` to true on the /shell-ng16/tsconfig.json
  const ngVersion = packageJson.dependencies['@angular/core'];
  (window as any).platform = (window as any).platform || {};
  let platform: PlatformRef = (window as any).platform[ngVersion];
  if (!platform) {
    console.log('creating angular platform with version', ngVersion);
    platform = platformBrowser();
    (window as any).platform[ngVersion] = platform;
  } else {
    console.log('reusing angular platform with version', ngVersion);
  }

  return platform;
}

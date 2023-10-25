import { Compiler, ComponentFactory, ComponentRef, Injector, ModuleWithComponentFactories, PlatformRef } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import packageJson from 'package.json';
import { MfePlatformModule } from './mfe-platform.module';

// The webpack configuration file at /multi-version-ng/mfe3-ng12/webpack.config.js
// exposes a webpack module which contains this function.
export async function bootstrapMyComponentAsync(): Promise<void> {
  const platform = getAngularPlatform();
  platform.bootstrapModule(MfePlatformModule);
}

// This function doesn't quite work.
// If the shell calls this function instead of the `bootstrapMyComponentAsync` above then
// the component does get rendered but without any CSS. Don't know how to fix this.
//
// Leaving it here just for demo purposes.
export async function bootstrapMyComponentAsyncV2(parentInjector: Injector, node: HTMLElement): Promise<void> {
  const ngComponentName = 'MyComponent';
  const compiler = new Compiler();
  const moduleWithComponentFactories: ModuleWithComponentFactories<unknown> = await compiler.compileModuleAndAllComponentsAsync(MfePlatformModule);
  const componentFactory: ComponentFactory<any> | undefined = moduleWithComponentFactories.componentFactories.find(x => x.componentType.name === ngComponentName);
  if (!componentFactory) {
    return;
  }

  const componentRef: ComponentRef<any> = componentFactory.create(parentInjector, undefined, node, undefined);
  componentRef.changeDetectorRef.detectChanges();
}

// This function makes sure that the only a version of Angular platform is
// instantiated per major version of Angular. Subsequent attempts to instantiate
// the same major version of Angular platform will instead retrieve it from
// the window.platform map.
//
// The code for this function was taken from the `Reuse Angular Platform` section of
// `Multi-Framework and -Version Micro Frontends with Module Federation: The Good, the Bad, the Ugly`
// available at:
// - https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-the-good-the-bad-the-ugly/
//
// For more information see the `What makes multi-version work` section of the README for
// this code demo.
function getAngularPlatform(): PlatformRef {
  // for the packageJson import to work we have to set `resolveJsonModule` and
  // `allowSyntheticDefaultImports` to true on the /mfe3-ng12/tsconfig.json
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

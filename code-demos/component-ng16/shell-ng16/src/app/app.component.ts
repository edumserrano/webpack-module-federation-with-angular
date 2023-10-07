import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import {
  Compiler,
  Component,
  ComponentFactory,
  ComponentRef,
  Injector,
  ModuleWithComponentFactories,
  NgModuleFactory,
  NgModuleRef,
  VERSION,
  ViewChild,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  /**
   * The ViewChild decorator is used to give us the ViewContainerRef of the
   * element with the template variable 'mfe'.
   * This _viewContainerRef property is what we can use to dynamically instante the remote component
   * into the the DOM.
   *
   * For more info see:
   * - ViewChild official docs: https://angular.io/api/core/ViewChild
   * - ViewChild: In-Depth Explanation: https://blog.angular-university.io/angular-viewchild/
   * - All about the ViewContainerRef: https://medium.com/nerd-for-tech/angular-viewcontainerref-a1e8d08eabc2
   * - Template variables: https://angular.io/guide/template-reference-variables
   */
  @ViewChild('mfe', { read: ViewContainerRef, static: true })
  private readonly _viewContainerRef?: ViewContainerRef;

  public constructor(
    private readonly _injector: Injector,
    private readonly _compiler: Compiler
  ) { }

  public readonly version: string = VERSION.full;

  /**
   * Removes the instance of the MyComponent Angular component that is part of the
   * MyFeatureModule that has been loaded from the external mfe1 app webpack module.
   */
  public RemoveComponent() : void {
    if (!this._viewContainerRef) {
      return;
    }

    this._viewContainerRef.clear();
  }

  /**
   * Loads the MyComponent Angular componenent that is part of the
   * MyFeatureModule that has been loaded from the external mfe1 app webpack module.
   *
   * This version doesn't rely on anything being coded specially on the remote Angular module
   * to facilidate the creation of the component. You only need to know the name of the exposed
   * Angular module and the name of the Angular component.
   *
   * On the one hand, this version has the positive quality of NOT needing to do any specific
   * code on the remote component to allow it to be dynamically instantiated. On the other, this
   * versoin has the negative quality that it uses Angular APIs that are considered deprecated.
   * The recommendation is to use the APIs that take a reference of the component type being created,
   * however when you're doing it fully dynamically and all you know are the names of things then
   * I don't know if there are alternative APIs to the ones that have been marked as deprecated.
   *
   */
  public async loadV1(): Promise<void> {
    if (!this._viewContainerRef) {
      // if there's no element that can be found with the template variable named 'mfe'
      // then we abort.
      return;
    }

    // we clear the _viewContainerRef at start because we will be creating and
    // inserting a component on it. If we don't clear then multiple runs of this code
    // would keep appending instances of the component.
    this._viewContainerRef.clear();

    // First, we use the loadRemoteModule from the @angular-architects/module-federation to load the
    // remote webpack module from the mfe1 app.
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      // exposedModule: this is the name of one of the webpack modules exposed by the mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      exposedModule: './my-feature-module',
      // remoteEntry: this is the URL where the webpack module from mfe1 app can be fetched from.
      // The mfe1 app is set to run on port 4201 and the filename remoteEntry.js is defined on the
      // webpack configuration file for mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);

    // ngModuleName is the name of the Angular module exposed by the mfe1 app that maps to the exposed
    // webpack module with the key './my-feature-module'.
    // If you check /component-ng16/mfe1-ng16/webpack.config.js, you can see that './my-feature-module' maps
    // to the './src/app/my-feature/my-feature.module.ts' file, which contains an Angular feature module named
    // MyFeatureModule.
    const ngModuleName = 'MyFeatureModule';
    // ngComponentName is the name of an Angular component that is declared in the above exposed Angular module.
    const ngComponentName = 'MyComponent';

    // Second, we get an instance of a factory that will allow us to instantiate the 'MyComponent'.
    // Note that compileModuleAndAllComponentsAsync is something you should only use if you don't have an alternative
    // because it's part of @angular/compiler which is currently considered a low level API and is  subject to internal changes.
    // For more see https://indepth.dev/posts/1054/here-is-what-you-need-to-know-about-dynamic-components-in-Angular and
    // the official docs https://angular.io/api/core/Compiler#!#compileModuleAndAllComponentsAsync-anchor
    const moduleWithComponentFactories: ModuleWithComponentFactories<unknown> = await this._compiler.compileModuleAndAllComponentsAsync(webpackModule[ngModuleName]);
    const componentFactory: ComponentFactory<any> | undefined = moduleWithComponentFactories.componentFactories.find(x => x.componentType.name === ngComponentName);
    if(!componentFactory) {
      return;
    }

    // Lastly, we can create an instance of the remote Angular component MyComponent and add it to the DOM using the ViewContainerRef.
    const componentRef : ComponentRef<any> = this._viewContainerRef.createComponent(componentFactory);
    componentRef.setInput('inputText','loaded v1'); // optional is case you want to set inputs

    // The 'setInput' method is the recommended way to set the input to dynamically created components since Angular 14.
    // However, you can also set the input by casting componentRef.instance to any and setting the input property like:
    // (componentRef.instance as any).inputText = 'loaded v1';

    // In some cases you might need to force Angular change detection to run when settings inputs. If you're setting your input and it's not working
    // then you can "trigger" angular's change detection by using one of the following:
    // 1) componentRef.changeDetectorRef.detectChanges();
    // 2) componentRef.changeDetectorRef.markForCheck();
  }

  /**
   * Loads the MyComponent Angular componenent that is part of the
   * MyFeatureModule that has been loaded from the external mfe1 app webpack module.
   *
   * As opposed to loadV1, this version relies on adding specific code to the remote to help instantiate
   * the remote component. For this version we rely on exposing the type of the component we want to
   * instantiate. We are doing this via a static property named 'entryComponentType' that is declared
   * on the MyFeatureModule at '/component-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts'.
   * You can do this however you want, as long as you're able to expose the component's type on the
   * remote webpack module.
   * As with loadV1, we still need to know the name of the Angular module that is exposed by the remote.
   *
   * As opposed to the loadV1, this version does not use any deprecated API in exchange for adding a bit
   * of specific code to the remote to allow us to dynamically instantiate the remote component.
   *
   */
  public async loadV2(): Promise<void> {
    if (!this._viewContainerRef) {
      // if there's no element that can be found with the template variable named 'mfe'
      // then we abort.
      return;
    }

    // we clear the _viewContainerRef at start because we will be creating and
    // inserting a component on it. If we don't clear then multiple runs of this code
    // would keep appending instances of the component.
    this._viewContainerRef.clear();

    // First, we use the loadRemoteModule from the @angular-architects/module-federation to load the
    // remote webpack module from the mfe1 app.
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      // exposedModule: this is the name of one of the webpack modules exposed by the mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      exposedModule: './my-feature-module',
      // remoteEntry: this is the URL where the webpack module from mfe1 app can be fetched from.
      // The mfe1 app is set to run on port 4201 and the filename remoteEntry.js is defined on the
      // webpack configuration file for mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);

    // ngModuleName is the name of the Angular module exposed by the mfe1 app that maps to the exposed
    // webpack module with the key './my-feature-module'.
    // If you check /component-ng16/mfe1-ng16/webpack.config.js, you can see that './my-feature-module' maps
    // to the './src/app/my-feature/my-feature.module.ts' file, which contains an Angular feature module named
    // MyFeatureModule.
    const ngModuleName = 'MyFeatureModule';
    // Second, we create an instance of the Angular module where the 'MyComponent' Angular component is declared.
    const ngModuleRef: NgModuleRef<unknown> = createNgModule(webpackModule[ngModuleName], this._injector);

    // Alternatively to using the above 'createNgModule' function we could have used done the following:
    //
    // const ngModuleFactory: NgModuleFactory<any> = await this._compiler.compileModuleAsync(webpackModule[ngModuleName]);
    // const ngModuleRef: NgModuleRef<unknown>  = ngModuleFactory.create(this._injector);
    //
    // However, the compileModuleAsync is something you should only use if you don't have an alternative
    // because it's part of @angular/compiler which is currently considered a low level API and is  subject to internal changes.
    // For more see https://indepth.dev/posts/1054/here-is-what-you-need-to-know-about-dynamic-components-in-Angular and
    // the official docs https://angular.io/api/core/Compiler#!#compileModuleAndAllComponentsAsync-anchor

    // Third, we get hold of the component type of the component we want to create, which is 'typeof MyComponent'.
    // The `entryComponentType` is a static property declared on the MyFeatureModule at
    // '/component-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts'.
    const componentType = webpackModule[ngModuleName].entryComponentType;

    // Lastly, we can create an instance of the remote Angular component and add it to the DOM using the ViewContainerRef
    const createComponentOptions = {
      injector: this._injector,
      ngModuleRef: ngModuleRef,
    };
    const componentRef = this._viewContainerRef.createComponent(componentType, createComponentOptions);
    componentRef.setInput('inputText','loaded v2'); // optional is case you want to set inputs

    // The 'setInput' method is the recommended way to set the input to dynamically created components since Angular 14.
    // However, you can also set the input by casting componentRef.instance to any and setting the input property like:
    // (componentRef.instance as any).inputText = 'loaded v2';

    // In some cases you might need to force Angular change detection to run when settings inputs. If you're setting your input and it's not working
    // then you can "trigger" angular's change detection by using one of the following:
    // 1) componentRef.changeDetectorRef.detectChanges();
    // 2) componentRef.changeDetectorRef.markForCheck();
  }

  /**
   * Loads the MyComponent Angular componenent that is part of the
   * MyFeatureModule that has been loaded from the external mfe1 app webpack module.
   *
   * As opposed to loadV1, this version relies on adding specific code to the remote to help instantiate
   * the remote component. For this version we rely on exposing a factory method that instantiates the remote
   * component. We are doing this via a method named 'getEntryComponent' and is declared on the MyFeatureModule at
   * '/component-ng16/mfe1-ng16/src/app/my-feature/my-feature.module.ts'.
   * You can do this however you want, as long as you're able to expose a factory method on the remote
   * webpack module.
   * As with loadV1 and loadV2, we still need to know the name of the Angular module that is exposed by the remote.
   *
   * As opposed to the loadV1, this version does not use any deprecated API in exchange for adding a bit
   * of specific code to the remote to allow us to dynamically instantiate the remote component.
   *
   */
  public async loadV3(): Promise<void> {
    if (!this._viewContainerRef) {
      // if there's no element that can be found with the template variable named 'mfe'
      // then we abort.
      return;
    }

    // we clear the _viewContainerRef at start because we will be creating and
    // inserting a component on it. If we don't clear then multiple runs of this code
    // would keep appending instances of the component.
    this._viewContainerRef.clear();

    // First, we use the loadRemoteModule from the @angular-architects/module-federation to load the
    // remote webpack module from the mfe1 app.
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      // exposedModule: this is the name of one of the webpack modules exposed by the mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      exposedModule: './my-feature-module',
      // remoteEntry: this is the URL where the webpack module from mfe1 app can be fetched from.
      // The mfe1 app is set to run on port 4201 and the filename remoteEntry.js is defined on the
      // webpack configuration file for mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);

    // Second, we create an instance of the Angular module where the 'MyComponent' Angular component is declared.
    //
    // Note that 'MyFeatureModule' is the name of the Angular module exposed by the mfe1 app that maps to the exposed
    // webpack module with the key './my-feature-module'.
    // If you check /component-ng16/mfe1-ng16/webpack.config.js, you can see that './my-feature-module' maps
    // to the './src/app/my-feature/my-feature.module.ts' file, which contains an Angular feature module named
    // MyFeatureModule.
    const ngModule: NgModuleRef<any> = createNgModule(webpackModule.MyFeatureModule, this._injector);

    // Third, we use the factory method that is on the remote Angular module to instantiate the component
    const componentRef: ComponentRef<any> = ngModule.instance.getEntryComponent();

    // Lastly, we insert the component on the DOM using the ViewContainerRef
    this._viewContainerRef.insert(componentRef.hostView);
    componentRef.setInput('inputText','loaded v3'); // optional is case you want to set inputs

    // The 'setInput' method is the recommended way to set the input to dynamically created components since Angular 14.
    // However, you can also set the input by casting componentRef.instance to any and setting the input property like:
    // (componentRef.instance as any).inputText = 'loaded v3';

    // In some cases you might need to force Angular change detection to run when settings inputs. If you're setting your input and it's not working
    // then you can "trigger" angular's change detection by using one of the following:
    // 1) componentRef.changeDetectorRef.detectChanges();
    // 2) componentRef.changeDetectorRef.markForCheck();
  }

  /**
   * Loads the MyComponent Angular componenent that is part of the
   * MyFeatureModule that has been loaded from the external mfe1 app webpack module.
   *
   * As opposed to loadV2 and loadV3, this version does NOT rely on specific code on the remote to help instantiate
   * the remote component. This is only possible because this version does not consume the './my-feature-module'
   * webpack module from the remote which exposes an Angular module. It consumes the './my-component' webpack module
   * which exposes the component we want to instantiate.
   *
   * For this version we need to know the name of the Angular component that is exposed by the remote.
   *
   */
  public async loadV4(): Promise<void> {
    if (!this._viewContainerRef) {
      // if there's no element that can be found with the template variable named 'mfe'
      // then we abort.
      return;
    }

    // we clear the _viewContainerRef at start because we will be creating and
    // inserting a component on it. If we don't clear then multiple runs of this code
    // would keep appending instances of the component.
    this._viewContainerRef.clear();

    // First, we use the loadRemoteModule from the @angular-architects/module-federation to load the
    // remote webpack module from the mfe1 app.
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      // exposedModule: this is the name of one of the webpack modules exposed by the mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      exposedModule: './my-component',
      // remoteEntry: this is the URL where the webpack module from mfe1 app can be fetched from.
      // The mfe1 app is set to run on port 4201 and the filename remoteEntry.js is defined on the
      // webpack configuration file for mfe1 app.
      // See /component-ng16/mfe1-ng16/webpack.config.js
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);

    // Lastly, we use the ViewContainerRef to create an instance of the Angular component named 'MyComponent'.
    //
    // Note that 'MyComponent' is the name of the Angular component exposed by the mfe1 app that maps to the exposed
    // webpack module with the key './my-component'.
    // If you check /component-ng16/mfe1-ng16/webpack.config.js, you can see that './my-component' maps
    // to the './src/app/my-feature/my-component/my-component.component.ts' file, which contains an Angular component
    // named MyComponent.
    const componentRef: ComponentRef<any> = this._viewContainerRef.createComponent(webpackModule.MyComponent);
    componentRef.setInput('inputText','loaded v4'); // optional is case you want to set inputs

    // The 'setInput' method is the recommended way to set the input to dynamically created components since Angular 14.
    // However, you can also set the input by casting componentRef.instance to any and setting the input property like:
    // (componentRef.instance as any).inputText = 'loaded v4';

    // In some cases you might need to force Angular change detection to run when settings inputs. If you're setting your input and it's not working
    // then you can "trigger" angular's change detection by using one of the following:
    // 1) componentRef.changeDetectorRef.detectChanges();
    // 2) componentRef.changeDetectorRef.markForCheck();
  }
}

import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { AfterContentInit, ComponentRef, Directive, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[loadRemoteComponent]',
})
export class LoadRemoteComponentDirective implements AfterContentInit {

  public constructor(private readonly _viewContainerRef: ViewContainerRef) { }

  @Input({required: true})
  public remoteEntry!: string;

  @Input({required: true})
  public exposedModule!: string;

  @Input({required: true})
  public componentName!: string;

  // Used to pass input values to the component
  // This is a map where the keys are of type string and map to the input property name and
  // the values can be anything which is why their type is unknown
  @Input()
  public inputData?: { [key: string]: unknown; };

  // This is an optional output from the directive which let's you know when
  // the component has been loaded. Not necessarily for loading the remote
  // component
  @Output()
  public loaded: EventEmitter<void> = new EventEmitter<void>();

  public async ngAfterContentInit(): Promise<void> {
    // the call to sleepAsync is for demo purposes ONLY. It's being done to be able to see the loading text before the component is loaded.
    // it's simulating a slow network fetching the remote webpack modules and or slow operations done by the component upon creation.
    await this.sleepAsync(2000);
    await this.loadRemotecomponent(this.exposedModule, this.remoteEntry);
  }

  public async loadRemotecomponent(exposedModule: string, remoteEntry: string): Promise<void> {
    if (!this._viewContainerRef) {
      // The directive should always be able to grab a ViewContainerRef to the element in
      // which the directive is inserted.
      // However, there might be some edge cases where this isn't true so we abort in this case.
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
      // exposedModule: this is the name of one of the webpack modules exposed by the remote app.
      exposedModule: exposedModule,
      // remoteEntry: this is the URL where the webpack module from the remote app can be fetched from.
       remoteEntry: remoteEntry,
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);

    // Second, we use the ViewContainerRef to create an instance of the Angular component
    // and add it to the DOM where this directive is applied to.
    const componentRef: ComponentRef<any> = this._viewContainerRef.createComponent(webpackModule[this.componentName]);

    // Third, we set inputs
    for (const inputPropertyName in this.inputData) {
      const inputPropertyValue = this.inputData[inputPropertyName];
      componentRef.setInput(inputPropertyName, inputPropertyValue);
    }

    // Lastly, we trigger the output indicating the component has been loaded
    this.loaded.emit();
  }

  public sleepAsync(ms: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

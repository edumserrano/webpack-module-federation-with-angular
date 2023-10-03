import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { AfterContentInit, Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[loadRemoteWebComponent]',
})
export class LoadRemoteWebComponentDirective implements AfterContentInit {

  @Input({required: true})
  public remoteEntry!: string;

  @Input({required: true})
  public exposedModule!: string;

  // This is an optional output from the directive which let's you know when
  // the component has been loaded.
  @Output()
  public loaded: EventEmitter<void> = new EventEmitter<void>();

  public async ngAfterContentInit(): Promise<void> {
    // the call to sleepAsync is for demo purposes ONLY. It's being done to be able to see the loading text before the component is loaded.
    // it's simulating a slow network fetching the remote webpack modules and or slow operations done by the component upon creation.
    await this.sleepAsync(2000);
    await this.loadRemotecomponent(this.exposedModule, this.remoteEntry);
  }

  public async loadRemotecomponent(exposedModule: string, remoteEntry: string): Promise<void> {
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
    // Lastly, we trigger the output indicating the component has been loaded
    this.loaded.emit();
  }

  public sleepAsync(ms: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

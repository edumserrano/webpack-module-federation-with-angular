import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { AfterContentInit, Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[loadRemoteWebComponent2]',
  standalone: true // TODO : note about this so that it can be used on the standalone component
})
export class LoadRemoteWebComponentDirective2 implements AfterContentInit {

  @Input({required: true})
  public remoteEntry!: string;

  @Input({required: true})
  public exposedModule!: string;

  @Input({required: true})
  public elementName!: string;

  // This is an optional output from the directive which let's you know when
  // the component has been loaded.
  @Output()
  public loaded: EventEmitter<void> = new EventEmitter<void>();

  public async ngAfterContentInit(): Promise<void> {
    await this.loadRemotecomponent(this.exposedModule, this.remoteEntry);
  }

  public async loadRemotecomponent(exposedModule: string, remoteEntry: string): Promise<void> {
    // TODO: we could do if NOT in prod do some console logs here to know what is being loaded and from where

    // TODO add try catch

    // First, we use the loadRemoteModule from the @angular-architects/module-federation to load the
    // remote webpack module from the mfe1 app.
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      // exposedModule: this is the name of one of the webpack modules exposed by the remote app.
      exposedModule: exposedModule,
      // remoteEntry: this is the URL where the webpack module from the remote app can be fetched from.
       remoteEntry: remoteEntry,
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    await webpackModule.mountAsync(this.elementName);
    // Lastly, we trigger the output indicating the component has been loaded
    this.loaded.emit();
  }
}

import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
  EventEmitter,
  VERSION,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('mfe', { read: ViewContainerRef, static: true })
  private readonly _viewContainerRef?: ViewContainerRef;

  public readonly version: string = VERSION.full;

  public messageFromComponent: string = "";

  public RemoveComponent(): void {
    this._viewContainerRef?.clear();
  }

  public async loadMyStandalone(): Promise<void> {
    if (!this._viewContainerRef) {
      return;
    }

    // load the component
    this._viewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './my-standalone-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    const componentRef: ComponentRef<any> = this._viewContainerRef.createComponent(webpackModule.MyStandaloneComponent);

    // set component input and subscribe to component outputs
    // componentRef.instance.inputText = "Hello!"; // this also works but for inputs the setInput method shown in the line below is the preferred way
    componentRef.setInput("inputText", "Hello!");
    (componentRef.instance.loadedEvent as EventEmitter<string>).subscribe(x=>{
      this.onComponentLoaded(x);
    });
    (componentRef.instance.destroyedEvent as EventEmitter<string>).subscribe(x=>{
      this.onComponentDestroyed(x);
    });
  }

  private onComponentLoaded(message: string) {
    this.messageFromComponent = message;
  }

  private onComponentDestroyed(message: string) {
    this.messageFromComponent = message;
  }
}

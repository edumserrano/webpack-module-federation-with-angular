import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
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

  // The correct way to interact with the document object in Angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) { }

  public reset(): void {
    this._document.location.href = "/";
  }

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
    // componentRef.instance.inputText = "Hello from the shell!"; // this also works but for inputs the setInput method shown in the line below is the preferred way
    componentRef.setInput("inputText", "Hello from the shell!");
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

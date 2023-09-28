import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
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

  public RemoveComponent() : void {
    if (!this._viewContainerRef) {
      return;
    }

    this._viewContainerRef.clear();
  }

  public async loadMyStandalone(): Promise<void> {
    if (!this._viewContainerRef) {
      return;
    }

    this._viewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './my-standalone-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    const componentRef: ComponentRef<unknown> = this._viewContainerRef.createComponent(webpackModule.MyStandaloneComponent);
  }

  public async loadAnotherStandalone(): Promise<void> {
    if (!this._viewContainerRef) {
      return;
    }

    this._viewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './another-standalone-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    const componentRef: ComponentRef<unknown> = this._viewContainerRef.createComponent(webpackModule.AnotherStandaloneComponent);
  }
}

import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import {
  Component,
  Injector,
  OnInit,
  VERSION,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('mfe1', { read: ViewContainerRef, static: true })
  private readonly _mfe1ViewContainerRef?: ViewContainerRef;

  @ViewChild('mfe2', { read: ViewContainerRef, static: true })
  private readonly _mfe2ViewContainerRef?: ViewContainerRef;

  @ViewChild('mfe3', { read: ViewContainerRef, static: true })
  private readonly _mfe3ViewContainerRef?: ViewContainerRef;

  @ViewChild('mfe4', { read: ViewContainerRef, static: true })
  private readonly _mfe4ViewContainerRef?: ViewContainerRef;

  public readonly version: string = VERSION.full;

  public constructor(private readonly _injector: Injector) { }

  public async ngOnInit(): Promise<void> {
    await this.loadMfe1Async();
    await this.loadMfe2Async();
    await this.loadMfe3Async();
    await this.loadMfe4Async();
  }

  private async loadMfe1Async(): Promise<void> {
    if (!this._mfe1ViewContainerRef) {
      return;
    }

    this._mfe1ViewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './my-standalone-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    this._mfe1ViewContainerRef.createComponent(webpackModule.MyStandaloneComponent);
  }

  private async loadMfe2Async(): Promise<void> {
    if (!this._mfe2ViewContainerRef) {
      return;
    }

    this._mfe2ViewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './remote-bootstrap',
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    await webpackModule.bootstrapMyComponentAsync(this._mfe2ViewContainerRef.element);
  }

  private async loadMfe3Async(): Promise<void> {
    if (!this._mfe3ViewContainerRef) {
      return;
    }

    this._mfe3ViewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'script',
      remoteName: 'mfe3',
      exposedModule: './remote-bootstrap',
      remoteEntry: 'http://localhost:4203/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    await webpackModule.bootstrapMyComponentAsync("mfe3-element", this._mfe3ViewContainerRef.element.nativeElement, this._injector);
    // await webpackModule.bootstrapMyComponentAsyncV2(this._injector,this._mfe3ViewContainerRef.element.nativeElement);
  }

  private async loadMfe4Async(): Promise<void> {
    if (!this._mfe4ViewContainerRef) {
      return;
    }

    this._mfe4ViewContainerRef.clear();
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'script',
      remoteName: 'mfe4',
      exposedModule: './my-component',
      remoteEntry: 'http://localhost:4204/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    this._mfe4ViewContainerRef.createComponent(webpackModule.MyComponent);
  }
}

import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-standalone-component-wrapper',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<my-mfe-element></my-mfe-element>',
})
export class MyStandaloneComponentWrapper implements OnInit {
  public async ngOnInit(): Promise<void> {
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './standalone-component-as-web-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule = await loadRemoteModule(
      loadRemoteWebpackModuleOptions
    );
    await webpackModule.bootstrapMyComponentAsync();
  }
}

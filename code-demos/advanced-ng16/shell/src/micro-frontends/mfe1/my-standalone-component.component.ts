import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';

@Component({
  selector: 'app-my-standalone-component1',
  standalone: true,
  imports: [CommonModule],
  template: '<my-mfe-element></my-mfe-element>',
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyStandaloneComponent implements OnInit { //TODO rename to mfe1-component or something like that, also update selector to something like mfe2-component

  public async ngOnInit(): Promise<void> {
    try {
      const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
        type: 'module',
        exposedModule: './standalone-component-as-web-component',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
      };
      const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
      await webpackModule.bootstrapMyComponentAsync();
    } catch (error) {
      // do something, at least do a console log, if not in prod(?), to show that there was an error loading the component
      // if we don't then we won't know what went wrong when tryng to remotely load this component
      console.error("error loading my standalone component", error);
    }
  }

}

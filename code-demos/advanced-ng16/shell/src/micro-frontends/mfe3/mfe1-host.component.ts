import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit } from '@angular/core';

// TODO: a version where the loading comes from the directive?
// <mf-bookings-entry
//       microFrontendRouting
//       microFrontendLanguage
//     ></mf-bookings-entry>
@Component({
  selector: 'app-mfe1-host',
  template: `<my-mfe-element></my-mfe-element>`,
})
export class Mfe1HostComponent implements OnInit {

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
      console.error("error loading Mfe1HostComponent", error);
    }
  }

}

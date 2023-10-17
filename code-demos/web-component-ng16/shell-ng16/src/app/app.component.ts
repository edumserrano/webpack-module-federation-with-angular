import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import {
  Component,
  OnInit,
  VERSION,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public readonly version: string = VERSION.full;

  public message: string = "";

  public async ngOnInit(): Promise<void> {
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './standalone-component-as-web-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    await webpackModule.bootstrapMyComponentAsync();
  };

  // Without the /src/app/mfe1.d.ts type declaration file the handler for the
  // 'message-sent' event must have an input of type Event and then you need
  // to cast it to CustomEvent<string>.
  //
  // With the /src/app/mfe1.d.ts type declaration file you can subscribe
  // to the 'message-sent' event and take in the type CustomEvent<string>
  // as the input. Like this:
  //
  // public onMessageSent(event: CustomEvent<string>): void {
  //   this.message = event.detail;
  // }
  //
  // Comment the 'onMessageSent(event: Event)' method below and uncomment the
  // 'onMessageSent(event: CustomEvent<string>)' method above to test it out.
  public onMessageSent(event: Event): void {
    this.message = (event as CustomEvent<string>).detail;
  }
}

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
    // const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
    //   type: 'module',
    //   exposedModule: './standalone-component-as-web-component',
    //   remoteEntry: 'http://localhost:4201/remoteEntry.js',
    // };
    // const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    // await webpackModule.bootstrapMyComponentAsync();
  };

  public onMessageSent(message: string): void {
    console.log("received message:", message);
  }
}

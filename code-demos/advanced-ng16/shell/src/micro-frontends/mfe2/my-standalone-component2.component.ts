import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-my-standalone-component2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-standalone-component2.component.html',
  styleUrls: ['./my-standalone-component2.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyStandaloneComponent2 { //TODO rename to mfe2-component or something like that, also update selector to something like mfe2-component. Actually also rename mfe1, mfe2 etc to better names like booking, payment, navbar etc

  @Input()
  public inputText?: string;

  @Output()
  public messageSentEvent: EventEmitter<string> = new EventEmitter<string>();

  public onMessageSent(event: Event): void {
    const messageSentEvent = event as CustomEvent<string>; // TODO use the HTMLElementTagNameMap to get the right typing for this? worth it? not sure if I'm creating a typed angular version
    this.messageSentEvent.emit(messageSentEvent.detail);
  }

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

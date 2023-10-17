import { Component, OnInit } from '@angular/core';
import { EventBus } from '../event-bus';
import { MessageSentEvent } from './message-sent-event';
import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-mfe1',
  templateUrl: './mfe1.component.html',
  styleUrls: ['./mfe1.component.css'],
})
export class Mfe1Component implements OnInit {
  public constructor(private readonly _eventBus: EventBus) {}

  public async ngOnInit(): Promise<void> {
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './standalone-component-as-web-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
    await webpackModule.bootstrapMyComponentAsync();
  }

  public messageSentEventHandler(event: Event): void {
    const messageSentEvent = MessageSentEvent.fromMessageSentCustomEvent(event);
    this._eventBus.publish(messageSentEvent);
  }
}

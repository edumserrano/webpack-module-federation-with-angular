import { Component, EventEmitter, Input, Output, VERSION } from '@angular/core';

// The webpack configuration file at /component-directive-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this Angular component
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css'],
})
export class MyComponent {
  public readonly version = VERSION.full;

  @Input()
  public inputText?: string;

  @Output()
  public messageSentEvent: EventEmitter<string> = new EventEmitter<string>();

  public sendMessage(): void {
    this.messageSentEvent.emit(`message sent from MyComponent loaded from the mfe1 app at ${new Date()}`);
  }
}

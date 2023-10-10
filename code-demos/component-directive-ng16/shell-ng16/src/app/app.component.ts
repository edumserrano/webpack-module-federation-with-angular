import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, VERSION } from '@angular/core';
import { InputData, OutputData } from './load-remote-component.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public readonly version: string = VERSION.full;
  public componentLoaded: boolean = false;
  public message: string = '';

  public readonly inputData: InputData = {
    inputText: 'loaded via loadRemoteComponent directive',
  };

  public readonly outputData: OutputData = {
    messageSentEvent: (output: EventEmitter<any>) => {
      output.subscribe((msg: string) => (this.message = msg));
    },
  };

  // The correct way to interact with the document object in Angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  public componentLoadedHandler(): void {
    this.componentLoaded = true;
  }

  public reload(): void {
    this._document.location.reload();
  }
}

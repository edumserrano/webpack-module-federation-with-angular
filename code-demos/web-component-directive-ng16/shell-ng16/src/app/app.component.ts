import { DOCUMENT } from '@angular/common';
import { Component, Inject, VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public readonly version: string = VERSION.full;
  public componentLoaded: boolean = false;
  public message: string = '';

  // The correct way to interact with the document object in Angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  public reload(): void {
    this._document.location.reload();
  }

  public componentLoadedHandler(): void {
    this.componentLoaded = true;
  }

  public onMessageSent(event: Event): void {
    this.message = (event as CustomEvent).detail;
  }
}

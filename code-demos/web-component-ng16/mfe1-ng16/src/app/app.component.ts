import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { bootstrapMyComponentAsync } from './my-standalone-component/my-standalone-component-bootstrap'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('webComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  private readonly _viewContainerRef?: ViewContainerRef;

  // The correct way to interact with the document object in angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  public async ngOnInit(): Promise<void> {
    await bootstrapMyComponentAsync();
  }

  public async mountWebComponentAsync(): Promise<void> {
    if (!this._viewContainerRef) {
      return;
    }

    if(this._document.querySelector('my-mfe-element')) {
      return;
    }

    const element: HTMLElement = this._document.createElement('my-mfe-element');
    this._viewContainerRef.element.nativeElement.appendChild(element);
  }

  public async unmountWebComponentAsync(): Promise<void> {
    if (!this._viewContainerRef) {
      return;
    }

    const webElement = this._document.querySelector('my-mfe-element');
    if(!webElement) {
      return;
    }

    this._viewContainerRef.element.nativeElement.removeChild(webElement);
  }
}

import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  VERSION,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /**
   * The ViewChild decorator is used to give us the ElementRef of the
   * element with the template variable 'mfe1'.
   * This _mfe1ElementRef property is what we can use to interact programmatically
   * with the my-mfe-element web component.
   *
   * For more info see:
   * - ViewChild official docs: https://angular.io/api/core/ViewChild
   * - ViewChild: In-Depth Explanation: https://blog.angular-university.io/angular-viewchild/
   * - All about the ViewContainerRef: https://medium.com/nerd-for-tech/angular-viewcontainerref-a1e8d08eabc2
   * - Template variables: https://angular.io/guide/template-reference-variables
   */
  @ViewChild('mfe1', { read: ElementRef, static: true })
  private readonly _mfe1ElementRef?: ElementRef<HTMLElement>;

  public readonly version: string = VERSION.full;

  public showMessages: boolean = false;

  public messageFromAngularOutputAtHtml: string = '';
  public messageFromAngularOutputAtHtml2: string = '';
  public messageFromAngularOutputAtComponent: string = '';
  public messageFromAngularOutputAtDocument: string = '';

  public messageFromManualCustomEventAtHtml: string = '';
  public messageFromManualCustomEventAtHtml2: string = '';
  public messageFromManualCustomEventAtComponent: string = '';
  public messageFromManualCustomEventAtDocument: string = '';

  // The correct way to interact with the document object in Angular is to use the DOCUMENT
  // injection token https://angular.io/api/common/DOCUMENT
  public constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  public async ngOnInit(): Promise<void> {
    const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
      type: 'module',
      exposedModule: './standalone-component-as-web-component',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
    };
    const webpackModule: any = await loadRemoteModule(
      loadRemoteWebpackModuleOptions
    );
    await webpackModule.bootstrapMyComponentAsync();

    if (!this._mfe1ElementRef) {
      return;
    }

    const myMfeElement: HTMLElement = this._mfe1ElementRef.nativeElement;
    // programatically subscribe to the messageSentEvent event at the my-mfe-element web component level
    myMfeElement.addEventListener('messageSentEvent', (event: Event) => {
      const messageSentEvent = event as CustomEvent<string>;
      this.messageFromAngularOutputAtComponent = messageSentEvent.detail;
    });
    // programatically subscribe to the messageSentEvent event at the document level
    this._document.addEventListener('greet', (event: Event) => {
      const messageSentEvent = event as CustomEvent<string>;
      this.messageFromAngularOutputAtDocument = messageSentEvent.detail;
    });
    // programatically subscribe to the greet-message event at the my-mfe-element web component level
    myMfeElement.addEventListener('greet-message', (event: Event) => {
      const greetEvent = event as CustomEvent<{ greet: string; time: Date }>;
      this.messageFromManualCustomEventAtComponent = `${greetEvent.detail.greet} ${greetEvent.detail.time}`;
    });
    // programatically subscribe to the greet-message event at the document level
    this._document.addEventListener('greet-message', (event: Event) => {
      const greetEvent = event as CustomEvent<{ greet: string; time: Date }>;
      this.messageFromManualCustomEventAtDocument = `${greetEvent.detail.greet} ${greetEvent.detail.time}`;
    });
  }

  // Handler from the declarative HTML subscription to the messageSentEvent event.
  // Subscription declared at the my-mfe-element web component level.
  public onMessageSent(event: Event): void {
    // this.showMessages property controls the visibility of all messages bound to the
    // HTML. Only need to set it to true once to enable the display of the messages.
    // No special reason to do it here, this is just code to help with the demo, don't pay
    // much attention to it.
    this.showMessages = true;

    //
    const messageSentEvent = event as CustomEvent<string>;
    this.messageFromAngularOutputAtHtml = messageSentEvent.detail;
  }

  // Handler from the declarative HTML subscription to the greet-message event
  // Subscription declared at the my-mfe-element web component level.
  public onGreet(event: Event): void {
    const greetEvent = event as CustomEvent<{ greet: string; time: Date }>;
    this.messageFromManualCustomEventAtHtml = `${greetEvent.detail.greet} ${greetEvent.detail.time}`;
  }


  // Handler from the declarative HTML subscription to the messageSentEvent event.
  // Subscription declared at the document level.
  public onMessageSent2(event: Event): void {
    const messageSentEvent = event as CustomEvent<string>;
    this.messageFromAngularOutputAtHtml2 = messageSentEvent.detail;
  }

  // handler from the declarative HTML subscription to the greet-message event
  public onGreet2(event: Event): void {
    const greetEvent = event as CustomEvent<{ greet: string; time: Date }>;
    this.messageFromManualCustomEventAtHtml2 = `${greetEvent.detail.greet} ${greetEvent.detail.time}`;
  }

}

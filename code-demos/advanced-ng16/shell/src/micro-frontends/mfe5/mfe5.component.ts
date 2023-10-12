import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRemoteWebComponentDirective2 } from '../load-remote-web-component2.directive';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
// TODO: note about the elementName on the directive matching the declared custom element
@Component({
  selector: 'mfe5-component',
  standalone: true,
  imports: [CommonModule, LoadRemoteWebComponentDirective2],
  template: `
    <my-mfe-element
      loadRemoteWebComponent2
      exposedModule="./standalone-component-as-web-component-mount"
      remoteEntry="http://localhost:4201/remoteEntry.js"
      elementName="my-mfe-element"
      (loaded)="componentLoadedHandler()"
    ></my-mfe-element>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //TODO this doesnt seem necessary when the template is declared inline for standalone components
})
export class Mfe5Component {

  public componentLoadedHandler(): void {
    console.log("component loaded with directive");
  }

}

import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRemoteWebComponentDirective } from '../load-remote-web-component.directive';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
@Component({
  selector: 'mfe4-component',
  standalone: true,
  imports: [CommonModule, LoadRemoteWebComponentDirective],
  template: `
    <my-mfe-element
      loadRemoteWebComponent
      exposedModule="./standalone-component-as-web-component-auto"
      remoteEntry="http://localhost:4201/remoteEntry.js"
      (loaded)="componentLoadedHandler()"
    ></my-mfe-element>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Mfe4Component {

  public componentLoadedHandler(): void {
    console.log("component loaded with directive");
  }

}

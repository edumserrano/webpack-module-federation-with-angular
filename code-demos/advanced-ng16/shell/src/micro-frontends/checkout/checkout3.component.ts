import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { remoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
@Component({
  selector: 'mfe-checkout-3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <mfe-checkout></mfe-checkout>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //TODO this doesnt seem necessary when the template is declared inline for standalone components
})
export class Checkout3Component {
}

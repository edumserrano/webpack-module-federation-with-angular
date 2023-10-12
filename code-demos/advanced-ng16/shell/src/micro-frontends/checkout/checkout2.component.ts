import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { remoteModuleDirective } from 'src/micro-frontends-tooling/remote-module.directive';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

// TODO: note about not having an .html and using the templateUrl prop. if it's simple you can consider not having a separate file but usually it's better to have that and the styleUrls
@Component({
  selector: 'mfe-checkout-2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <mfe-checkout-web-component></mfe-checkout-web-component>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //TODO this doesnt seem necessary when the template is declared inline for standalone components
})
export class Checkout2Component implements OnInit {

  public constructor(private readonly _route: ActivatedRoute) {}

  public async ngOnInit(): Promise<void> {
    const webpackModule: any = this._route.snapshot.data["remoteModule"];
    const elementName = "mfe-checkout-web-component"; // TODO: note about the elementName on the directive matching the declared custom element
    await webpackModule.mountAsync(elementName); // TODO consider creating a type to define this instead of using any? Does Zod help? check how at https://sergiodxa.com/articles/using-zod-to-safely-read-env-variables and https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
  }
}

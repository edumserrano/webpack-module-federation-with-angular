import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { remoteModuleResolver } from 'src/micro-frontends-tooling/remote-module.resolver';

@Component({
  selector: 'app-checkout-mfe',
  standalone: true,
  imports: [],
  template: `
    <mfe-checkout></mfe-checkout>
  `,
  styleUrls: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutComponent implements OnInit {

  public constructor(private readonly _route: ActivatedRoute) {}

  public async ngOnInit(): Promise<void> {
    // TODO: note about the elementName on the directive matching the declared
    // custom element
    // TODO consider creating a type to define webpackModule.mountAsync instead of
    // using any? Does Zod help?
    // check how at https://sergiodxa.com/articles/using-zod-to-safely-read-env-variables
    // and https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
    const webpackModule: any = this._route.snapshot.data["remoteModule"];
    const elementName = "mfe-checkout";
    await webpackModule.mountAsync(elementName);
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
    resolve: {
      remoteModule: remoteModuleResolver({
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout",
      }),
    },
  },
]


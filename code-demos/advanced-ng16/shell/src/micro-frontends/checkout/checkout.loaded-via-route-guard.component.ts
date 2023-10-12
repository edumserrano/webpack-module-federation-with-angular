import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { remoteModuleGuard } from 'src/micro-frontends-tooling/remote-module.guard';

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

  ngOnInit(): void {
    console.log("ngOnInit:", this._route)
  }
}

export const MFE_CHECKOUT_ROUTES: Routes = [
  {
    path: '**',
    component: CheckoutComponent,
    canActivate: [
      remoteModuleGuard({
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout-auto",
      })
    ],
  },
]

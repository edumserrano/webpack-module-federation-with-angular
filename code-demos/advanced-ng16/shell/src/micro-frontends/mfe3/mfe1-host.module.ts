import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { Mfe1HostComponent } from "./mfe1-host.component";
import { RouterModule } from "@angular/router";

// const getMicrofrontendBundleUrl = (frontendName: 'bookings') =>
//   `/frontends/${frontendName}/main.js`;

@NgModule({
  declarations: [
    Mfe1HostComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '**',
        // canActivate: [LoadMicroFrontendGuard],
        component: Mfe1HostComponent,
        // data: {
        //   bundleUrl: environment.production
        //     ? getMicrofrontendBundleUrl('bookings')
        //     : 'http://localhost:4201/main.js',
        // },
      },
    ]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Mfe1HostModule {}

import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyStandaloneComponent } from 'src/micro-frontends/mfe1/my-standalone-component.component';
import { AppComponent } from './app.component';
import { remoteModuleResolver } from 'src/micro-frontends-tooling/remote-module.resolver';
import { remoteModuleGuard } from 'src/micro-frontends-tooling/remote-module.guard';

export const routes: Routes = [
  // {
  //   path: 'mfe1',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //       exposedModule: './standalone-routes',
  //     })
  //       .then((m) => m.STANDALONE_COMPONENTS_ROUTES)
  //       .catch((err) =>
  //         console.error('Error lazy loading standalone-routes', err)
  //       ),
  // },

  // {
  //   path: 'mfe1',
  //   loadComponent: () => MyStandaloneComponent,
  // },
  // {
  //   path: 'mfe11',
  //   loadComponent: () => {
  //      const myComp1 = import('../micro-frontends/mfe1/my-standalone-component.component')
  //       .then((m) => m.MyStandaloneComponent)
  //       .catch((err) => console.error('Error lazy loading /mfe1', err));
  //     return myComp1 as Promise<any>;
  //   }
  // },
  // {
  //   path: 'mfe1',
  //   loadComponent: () =>
  //     import('../micro-frontends/mfe1/my-standalone-component.component')
  //       .then((m) => m.MyStandaloneComponent)
  //       .catch((err) => {
  //         console.error('Error lazy loading /mfe1', err);
  //         return Promise.resolve<any>(null);
  //       }),
  // },
  // {
  //   path: 'mfe1',
  //   loadComponent: async () => {
  //     try {
  //       const localModule = await import('../micro-frontends/mfe1/my-standalone-component.component');
  //       // throw new Error("simulate error");
  //       return localModule.MyStandaloneComponent;
  //     } catch (error) {
  //       console.error('Error lazy loading /mfe1', error);
  //       // throw error; // do whatever you want, rethrow the exception,  show an error page
  //       return Promise.resolve<any>(null); // returning null will have no effect on the router outlet, nothing will be rendered, only the console error is displayed
  //     }
  //   },
  // },

  // {
  //   path: 'mfe1',
  //   loadComponent: async () => {
  //     // change the localECMAScriptModule name but explain this is a locally imported ECMAScript Module
  //       const localECMAScriptModule = await import('../micro-frontends/mfe1/my-standalone-component.component');
  //       // throw new Error("simulate error");
  //       return localECMAScriptModule.MyStandaloneComponent;
  //   },
  // },
  // {
  //   path: 'mfe2',
  //   loadComponent: async () => {
  //       const localModule = await import('../micro-frontends/mfe2/my-standalone-component2.component');
  //       return localModule.MyStandaloneComponent2;
  //   },
  // },
  // {
  //   path: 'mfe3',
  //   loadChildren: async () => {
  //       const localModule = await import('../micro-frontends/mfe3/mfe1-host.module');
  //       return localModule.Mfe1HostModule;
  //   },
  // },
  // {
  //   path: 'mfe4',
  //   loadComponent: async () => {
  //       const localModule = await import('../micro-frontends/mfe4/mfe4.component');
  //       return localModule.Mfe4Component;
  //   },
  // },
  // {
  //   path: 'mfe5',
  //   loadComponent: async () => {
  //       const localModule = await import('../micro-frontends/mfe5/mfe5.component');
  //       return localModule.Mfe5Component;
  //   },
  // },
  // {
  //   path: 'mfe6',
  //   loadComponent: async () => {
  //       const localModule = await import('../micro-frontends/mfe6/mfe6.component');
  //       return localModule.Mfe6Component;
  //   },
  // },
  // {
  //   path: 'mfe7',
  //   loadComponent: async () => {
  //       const localModule = await import('../micro-frontends/mfe7/mfe7.component');
  //       return localModule.Mfe7Component;
  //   },
  // },

  // TODO set input and bind outputs for the checkout component demos
  // TODO move the guards/resolvers/etc to the wrapper component
  // test passing data from here to see if it shows up on the child route from the host
  {
    path: 'checkout',
    loadComponent: async () => {
      const localModule = await import('../micro-frontends/checkout/checkout.component');
      return localModule.CheckoutComponent;
    },
  },
  {
    path: 'checkout-2',
    loadComponent: async () => {
      const localModule = await import('../micro-frontends/checkout/checkout2.component');
      return localModule.Checkout2Component;
    },
    data: {
      remoteEntry: "http://localhost:4201/remoteEntry.js",
      exposedModule: "./checkout",
    },
    resolve: {
      remoteModule: remoteModuleResolver,
    },
  },
  {
    path: 'checkout-3',
    loadComponent: async () => {
      const localModule = await import('../micro-frontends/checkout/checkout3.component');
      return localModule.Checkout3Component;
    },
    // data: {
    //   remoteEntry: "http://localhost:4201/remoteEntry.js",
    //   exposedModule: "./checkout-auto",
    // },
    canActivate: [
      remoteModuleGuard({
        remoteEntry: "http://localhost:4201/remoteEntry.js",
        exposedModule: "./checkout-auto2",
      })
    ],
  },
  // {
  //   path: 'payment',
  //   loadComponent: async () => {
  //     const localModule = await import('../micro-frontends/payment/payment.component');
  //     return localModule.PaymentComponent;
  //   },
  // },
  {
    path: 'payment',
    loadChildren: async () => {
      const localModule = await import('../micro-frontends/payment/payment.component');
      return localModule.MFE_PAYMENT_ROUTES;
    },
  },
  {
    path: 'payment-2',
    loadChildren: async () => {
      const localModule = await import('../micro-frontends/payment/payment2.component');
      return localModule.MFE_PAYMENT_ROUTES_2;
    },
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

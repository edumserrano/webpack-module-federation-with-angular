import { ENVIRONMENT_INITIALIZER, EnvironmentInjector, Injectable, Provider, inject, runInInjectionContext } from '@angular/core';
import { EventType, NavigationError, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

// based on the withNavigationErrorHandler Angular approach
//
// https://github.com/angular/angular/blob/c2b1a242e8db0ef8e03f7ee85ffa1f82562fd735/packages/router/src/provide_router.ts#L637-L652
// https://medium.com/@artur.fedotiew/%EF%B8%8F-simplifying-navigation-error-handling-with-angulars-upcoming-feature-%EF%B8%8F-b55ee04d246a
export function withNavigationErrorHandler(fn: (error: NavigationError) =>  void): Provider {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const injector: EnvironmentInjector = inject(EnvironmentInjector);
      const router = inject(Router);
      // router.events.subscribe(e=> {

      //   switch(e.type) {
      //     case EventType.NavigationError: {
      //       e.
      //     }
      //   }
      // });
      router.events
        .pipe(
          filter((event: unknown) => event instanceof NavigationError),
          map((event: unknown) => event as NavigationError)
        )
        .subscribe((navError: NavigationError) => {
          runInInjectionContext(injector, () => fn(navError));
        });
    }
  };
}


// {
//   provide: APP_INITIALIZER,
//   useFactory: initializeNavigationFailedService,
//   multi: true,
//   deps: [NavigationFailedService],
// },

// export function initializeNavigationFailedService(navigationFailedService: NavigationFailedService): () => void {
//   return (): void => {
//     navigationFailedService.setupSubscriptions();
//   };
// }

// @Injectable({ providedIn: 'root' })
// export class NavigationFailedService {
//   public constructor(private readonly _router: Router) {}

//   public setupSubscriptions(): void {
//     this._router.events
//       .pipe(
//         filter((event: unknown) => event instanceof NavigationError),
//         map((event: unknown) => event as NavigationError)
//       )
//       .subscribe((event: NavigationError) => {
//         this.onNavigationError(event);
//       });
//   }

//   public onNavigationError(event: NavigationError): void {
//     // do whatever you want on navigation error.
//     // you could use the this._router and navigate to an error page for instance
//     // you could choose to display some kind of pop up/notification error message
//     // etc
//     console.error('Navigation failed', event.error, event);
//   }
// }

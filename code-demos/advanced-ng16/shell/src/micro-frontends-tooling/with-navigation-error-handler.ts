import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentInjector,
  Provider,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { NavigationError, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

// Based on the withNavigationErrorHandler Angular approach
//
// https://github.com/angular/angular/blob/c2b1a242e8db0ef8e03f7ee85ffa1f82562fd735/packages/router/src/provide_router.ts#L637-L652
// https://medium.com/@artur.fedotiew/%EF%B8%8F-simplifying-navigation-error-handling-with-angulars-upcoming-feature-%EF%B8%8F-b55ee04d246a
//
// Also see 'Getting to know the ENVIRONMENT_INITIALIZER Injection Token in Angular' at
// https://netbasal.com/getting-to-know-the-environment-initializer-injection-token-in-angular-9622cb824f57
export function withNavigationErrorHandler(fn: (error: NavigationError) => void): Provider {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const injector: EnvironmentInjector = inject(EnvironmentInjector);
      const router = inject(Router);
      router.events
        .pipe(
          filter((event: unknown) => event instanceof NavigationError),
          map((event: unknown) => event as NavigationError)
        )
        .subscribe((navError: NavigationError) => {
          runInInjectionContext(injector, () => fn(navError));
        });
    },
  };
}

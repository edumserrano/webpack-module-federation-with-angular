import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentInjector,
  Provider,
  inject,
  runInInjectionContext
} from '@angular/core';
import { RemoteModuleEvent } from './remote-module-events';
// import { RemoteModuleEventsService } from './remote-module-events.service';
import { REMOTE_MODULE_EVENTS } from './remote-module.service';

// based on the withNavigationErrorHandler Angular approach
//
// https://github.com/angular/angular/blob/c2b1a242e8db0ef8e03f7ee85ffa1f82562fd735/packages/router/src/provide_router.ts#L637-L652
// https://medium.com/@artur.fedotiew/%EF%B8%8F-simplifying-navigation-error-handling-with-angulars-upcoming-feature-%EF%B8%8F-b55ee04d246a

export function withRemoteModuleEventsHandler(
  fn: (event: RemoteModuleEvent) => void
): Provider {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const injector: EnvironmentInjector = inject(EnvironmentInjector);
      // const loadRemoteWebComponentEventsService = inject(RemoteModuleEventsService);
      const remoteModuleEvents$ = inject(REMOTE_MODULE_EVENTS);
      remoteModuleEvents$.subscribe((event) => {
        runInInjectionContext(injector, () => fn(event));
      });
    },
  };
}

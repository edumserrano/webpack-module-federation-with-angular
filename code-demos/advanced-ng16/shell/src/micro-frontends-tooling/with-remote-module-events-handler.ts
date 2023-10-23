import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentInjector,
  Provider,
  inject,
  runInInjectionContext
} from '@angular/core';
import { RemoteModuleEvent } from './remote-module-events';
import { REMOTE_MODULE_EVENTS } from './remote-module.service';

// See 'Getting to know the ENVIRONMENT_INITIALIZER Injection Token in Angular' at
// https://netbasal.com/getting-to-know-the-environment-initializer-injection-token-in-angular-9622cb824f57
export function withRemoteModuleEventsHandler(
  fn: (event: RemoteModuleEvent) => void
): Provider {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const injector: EnvironmentInjector = inject(EnvironmentInjector);
      const remoteModuleEvents$ = inject(REMOTE_MODULE_EVENTS);
      remoteModuleEvents$.subscribe((event) => {
        runInInjectionContext(injector, () => fn(event));
      });
    },
  };
}

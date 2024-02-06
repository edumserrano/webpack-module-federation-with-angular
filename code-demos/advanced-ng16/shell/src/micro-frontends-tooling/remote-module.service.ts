import {
  LoadRemoteModuleOptions,
  loadRemoteModule,
} from '@angular-architects/module-federation';
import { Injectable, InjectionToken, inject } from '@angular/core';
import {
  RemoteModuleEvent,
  RemoteModuleFailed,
  RemoteModuleLoaded,
  RemoteModuleLoading,
} from './remote-module-events';
import { Observable, Subject } from 'rxjs';

// The REMOTE_MODULE_EVENTS InjectionToken was based on the idea explained in
// "The Hidden Power of InjectionToken Factory Functions in Angular":
// - https://netbasal.com/the-hidden-power-of-injectiontoken-factory-functions-in-angular-d42d5575859b
export type RemoteModuleEvents = Observable<RemoteModuleEvent>;
export const REMOTE_MODULE_EVENTS = new InjectionToken<RemoteModuleEvents>(
  'Remote module events',
  {
    factory() {
      const remoteModuleService = inject(RemoteModuleService);
      return remoteModuleService.events$;
    },
  }
);

export const enum RemoteModuleResultTypes {
  Loaded = 'Loaded',
  Failed = 'Failed',
}

export type RemoteModuleResult = RemoteModuleLoadedResult | RemoteModuleFailedResult;

export class RemoteModuleLoadedResult {
  public constructor(public readonly webpackModule: any) {}

  public readonly type = RemoteModuleResultTypes.Loaded;
}

export class RemoteModuleFailedResult {
  public constructor(public readonly error: Error) {}

  public readonly type = RemoteModuleResultTypes.Failed;
}

export type LoadRemoteModuleOptionsExtended = LoadRemoteModuleOptions & {
  id: string;
};

@Injectable({ providedIn: 'root' })
export class RemoteModuleService {
  private readonly _events = new Subject<RemoteModuleEvent>();

  public readonly events$ = this._events.asObservable();

  public async loadAsync(options: LoadRemoteModuleOptionsExtended): Promise<RemoteModuleResult> {
    try {
      this.triggerLoading(options);
      const webpackModule: any = await loadRemoteModule(options);
      this.triggerLoaded(options, webpackModule);
      return new RemoteModuleLoadedResult(webpackModule);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error; //should always be of type Error but if not rethrow
      }

      this.triggerFailed(options, error);
      return new RemoteModuleFailedResult(error);
    }
  }

  private triggerLoading(options: LoadRemoteModuleOptionsExtended) {
    const event = new RemoteModuleLoading(
      options.id,
      options);
    this._events.next(event);
  }

  private triggerLoaded(
    options: LoadRemoteModuleOptionsExtended,
    webpackModule: any,
  ) {
    const event = new RemoteModuleLoaded(
      options.id,
      options,
      webpackModule);
    this._events.next(event);
  }

  private triggerFailed(
    options: LoadRemoteModuleOptionsExtended,
    error: Error
  ) {
    const event = new RemoteModuleFailed(
      options.id,
      options,
      error);
    this._events.next(event);
  }
}

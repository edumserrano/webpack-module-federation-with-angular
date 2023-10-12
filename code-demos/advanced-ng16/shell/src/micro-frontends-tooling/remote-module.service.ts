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

@Injectable({ providedIn: 'root' })
export class RemoteModuleService {
  private readonly _events = new Subject<RemoteModuleEvent>();

  public readonly events$ = this._events.asObservable();

  // TODO: we could do if NOT in prod do some console logs here to know what is being
  // loaded and from where
  // should also log the webpack module for easier debugging. should only log if not prod and some other
  // env variable like remoteModuleDebug=true
  public async load(
    exposedModule: string,
    remoteEntry: string,
    loadRemoteModuleCallback: (webpackModule: any) => void | Promise<void>
  ): Promise<RemoteModuleResult> {
    try {
      this.triggerLoading();
      const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
        type: 'module',
        exposedModule: exposedModule,
        remoteEntry: remoteEntry,
      };
      const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
      await loadRemoteModuleCallback(webpackModule);
      this.triggerLoaded();
      return new RemoteModuleLoadedResult(webpackModule);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error; //should always be of type Error but if not rethrow
      }

      this.triggerFailed(error);
      return new RemoteModuleFailedResult(error);
    }
  }

  private triggerLoading() {
    const event = new RemoteModuleLoading();
    this._events.next(event);
  }

  private triggerLoaded() {
    const event = new RemoteModuleLoaded();
    this._events.next(event);
  }

  private triggerFailed(error: Error) {
    const event = new RemoteModuleFailed(error);
    this._events.next(event);
  }
}

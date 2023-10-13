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

// TODO explain this with link to injection token magic article
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

  public async loadAsync(
    id: string,
    exposedModule: string,
    remoteEntry: string,
  ): Promise<RemoteModuleResult>;

  public async loadAsync(
    id: string,
    exposedModule: string,
    remoteEntry: string,
    loadRemoteModuleCallback: (webpackModule: any) => void | Promise<void>
  ): Promise<RemoteModuleResult>;

  // TODO: we could do if NOT in prod do some console logs here to know what is being
  // loaded and from where
  // should also log the webpack module for easier debugging. should only log if not prod and some other
  // env variable like remoteModuleDebug=true
  public async loadAsync(
    id: string,
    exposedModule: string,
    remoteEntry: string,
    loadRemoteModuleCallback?: (webpackModule: any) => void | Promise<void>
  ): Promise<RemoteModuleResult> {
    try {
      loadRemoteModuleCallback = loadRemoteModuleCallback ?? function (_: any): void {};
      this.triggerLoading(id, exposedModule, remoteEntry);

      const loadRemoteWebpackModuleOptions: LoadRemoteModuleOptions = {
        type: 'module',
        exposedModule: exposedModule,
        remoteEntry: remoteEntry,
      };
      const webpackModule: any = await loadRemoteModule(loadRemoteWebpackModuleOptions);
      await loadRemoteModuleCallback(webpackModule);

      this.triggerLoaded(id, exposedModule, remoteEntry, webpackModule);
      return new RemoteModuleLoadedResult(webpackModule);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error; //should always be of type Error but if not rethrow
      }

      this.triggerFailed(id, exposedModule, remoteEntry, error);
      return new RemoteModuleFailedResult(error);
    }
  }

  private triggerLoading(
    id: string,
    exposedModule: string,
    remoteEntry: string,
  ) {
    const event = new RemoteModuleLoading(
      id,
      exposedModule,
      remoteEntry);
    this._events.next(event);
  }

  private triggerLoaded(
    id: string,
    exposedModule: string,
    remoteEntry: string,
    webpackModule: any,
  ) {
    const event = new RemoteModuleLoaded(
      id,
      exposedModule,
      remoteEntry,
      webpackModule);
    this._events.next(event);
  }

  private triggerFailed(
    id: string,
    exposedModule: string,
    remoteEntry: string,
    error: Error
  ) {
    const event = new RemoteModuleFailed(
      id,
      exposedModule,
      remoteEntry,
      error);
    this._events.next(event);
  }
}

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

export type LoadRemoteModuleOptionsExtended = LoadRemoteModuleOptions & {
  id: string;
};

@Injectable({ providedIn: 'root' })
export class RemoteModuleService {
  private readonly _events = new Subject<RemoteModuleEvent>();

  public readonly events$ = this._events.asObservable();

  // TODO: we could do if NOT in prod do some console logs here to know what is being
  // loaded and from where
  // should also log the webpack module for easier debugging. should only log if not prod and some other
  // env variable like remoteModuleDebug=true
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
    if(options.type === 'manifest')
    {
      options.remoteName
    }
    else if(options.type === 'module') {
      options.remoteEntry
    }
    else if(options.type === 'script') {
      options.remoteEntry;
      options.remoteName
    }
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

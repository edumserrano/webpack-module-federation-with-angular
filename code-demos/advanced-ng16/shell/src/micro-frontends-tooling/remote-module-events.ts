import { LoadRemoteModuleOptions } from "@angular-architects/module-federation";

export const enum RemoteModuleEventTypes {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Failed = 'Failed',
}

export type RemoteModuleEvent = RemoteModuleLoading | RemoteModuleLoaded | RemoteModuleFailed;

export class RemoteModuleLoading {
  public constructor(
    public readonly id: string,
    public readonly options: LoadRemoteModuleOptions,
  ) { }

  public readonly type = RemoteModuleEventTypes.Loading;
}

export class RemoteModuleLoaded {
  public constructor(
    public readonly id: string,
    public readonly options: LoadRemoteModuleOptions,
    public readonly webpackModule: any,
  ) { }

  public readonly type = RemoteModuleEventTypes.Loaded;
}

export class RemoteModuleFailed  {
  public constructor(
    public readonly id: string,
    public readonly options: LoadRemoteModuleOptions,
    public readonly error: Error,
  ) { }

  public readonly type = RemoteModuleEventTypes.Failed;
}

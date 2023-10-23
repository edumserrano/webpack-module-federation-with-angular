import { LoadRemoteModuleOptions } from "@angular-architects/module-federation";

export const enum RemoteModuleEventTypes {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Failed = 'Failed',
}

export type RemoteModuleEvent = RemoteModuleLoading | RemoteModuleLoaded | RemoteModuleFailed;

// TODO: explain that you could augment the data on the events to include
// more helpful stuff like source and target elements, anything that you feel
// would help provide a better debug experience.
// The only "extra" field we added was id to be able to filter events for
// specific components. The id should be unique.

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

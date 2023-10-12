export const enum RemoteModuleEventTypes {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Failed = 'Failed',
}

export type RemoteModuleEvent = RemoteModuleLoading | RemoteModuleLoaded | RemoteModuleFailed;

// TODO define properties for each event
export class RemoteModuleLoading {
  public readonly type = RemoteModuleEventTypes.Loading;
}

export class RemoteModuleLoaded {
  public readonly type = RemoteModuleEventTypes.Loaded;
}

export class RemoteModuleFailed  {
  public constructor(public readonly error: Error) {}

  public readonly type = RemoteModuleEventTypes.Failed;
}

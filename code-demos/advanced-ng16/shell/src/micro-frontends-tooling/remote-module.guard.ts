import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RemoteModuleResultTypes, RemoteModuleService } from './remote-module.service';

export type remoteModuleGuardOptions = {
  remoteEntry: string;
  exposedModule: string;
};

export function remoteModuleGuard(options: remoteModuleGuardOptions): CanActivateFn {
  // export declare type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
  //
  // note that we are returning the type of CanActivateFn
  // in here we aren't taking any input params but the CanActivateFn signature allows
  // for the (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) which means the signature
  // could take any those input params, such as:
  // return async (route: ActivatedRouteSnapshot): Promise<boolean> => { }
  //
  // The same can be said for the return params, the CanActivateFn can return many types, for this
  // example we use the Promise<boolean>
  return async (): Promise<boolean> => {
    const remoteModuleService = inject(RemoteModuleService);
    // TODO: the callback param is only needed because I'm using the service in multiple ways
    // this param could not be needed.
    const callback = function (_: any) {};
    const result = await remoteModuleService.load(
      options.exposedModule,
      options.remoteEntry,
      callback
    );

    switch(result.type) {
      case RemoteModuleResultTypes.Loaded:
        return true;
      case RemoteModuleResultTypes.Failed:
        return false;
      default:
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  };
}

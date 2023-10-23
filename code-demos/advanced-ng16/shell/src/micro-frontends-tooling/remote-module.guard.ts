import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import {
  RemoteModuleResultTypes,
  RemoteModuleService,
} from './remote-module.service';
import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';

export type RemoteModuleGuardOptions = LoadRemoteModuleOptions & {
  id: string;
};

export function remoteModuleGuard(guardOptions: RemoteModuleGuardOptions): CanActivateFn {
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
    // RemoteModuleGuardOptions type has the same shape as LoadRemoteModuleOptionsExtended
    // so I can just flow it into the remoteModuleService.loadAsync call
    const result = await remoteModuleService.loadAsync(guardOptions);
    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        return true;
      case RemoteModuleResultTypes.Failed:
        return false;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  };
}

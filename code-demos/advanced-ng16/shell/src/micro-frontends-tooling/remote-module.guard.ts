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
  // Note that we are returning the type of CanActivateFn which is declared as:
  //
  // export declare type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
  //
  // Although the CanActivateFn type allows for a function with the
  // (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) inputs, the function we
  // are returning doesn't have any input params.
  //
  // The way this works is that we can return a function with:
  // - no input parameters.
  // - some or all of the input parameters from the CanActivateFn type. For instance:
  // `return async (route: ActivatedRouteSnapshot): Promise<boolean> => { }` would be valid
  // and would give us access to the ActivatedRouteSnapshot.
  //
  // If we need access to more types other than the available ones in the CanActivateFn we
  // can use the inject function to retrieve them, just like we are doing with:
  // `const remoteModuleService = inject(RemoteModuleService)`.
  //
  // Also note that the CanActivateFn can return many different types, for this implementation
  // we use the Promise<boolean> return type.
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

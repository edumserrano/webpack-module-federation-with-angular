import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  RemoteModuleResultTypes,
  RemoteModuleService,
} from './remote-module.service';
import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';

export type RemoteModuleResolverOptions = LoadRemoteModuleOptions & {
  id: string;
};

export function remoteModuleResolver(resolverOptions: RemoteModuleResolverOptions): ResolveFn<any> {
  // Note that we are returning the type of ResolveFn which is declared as:
  //
  // export declare type ResolveFn<T> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T> | Promise<T> | T;
  //
  // Although the ResolveFn type allows for a function with the
  // (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) inputs, the function we
  // are returning doesn't have any input params.
  //
  // The way this works is that we can return a function with:
  // - no input parameters.
  // - some or all of the input parameters from the ResolveFn type. For instance:
  // `return async (route: ActivatedRouteSnapshot): Promise<boolean> => { }` would be valid
  // and would give us access to the ActivatedRouteSnapshot.
  //
  // If we need access to more types other than the available ones in the ResolveFn we
  // can use the inject function to retrieve them, just like we are doing with:
  // `const remoteModuleService = inject(RemoteModuleService)`.
  //
  // Also note that the ResolveFn can return many different types, for this implementation
  // we use the Promise<T> return type.
  return async (): Promise<any> => {
    const remoteModuleService = inject(RemoteModuleService);
    // RemoteModuleResolverOptions type has the same shape as LoadRemoteModuleOptionsExtended
    // so I can just flow it into the remoteModuleService.loadAsync call
    const result = await remoteModuleService.loadAsync(resolverOptions);
    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        return result.webpackModule;
      case RemoteModuleResultTypes.Failed:
        return null;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  };
}

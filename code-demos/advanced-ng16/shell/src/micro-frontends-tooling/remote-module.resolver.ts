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

// TODO: also add a note about the ResolveFn return type and how to pass router to the
// return function, see note about CanActivateFn on remoteModuleGuard
// export declare type ResolveFn<T> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T> | Promise<T> | T;

// TODO create a webpack module type that has nothing but it's used to help provide intent
// so instead ResolveFn<any> you would ResolveFn<WebpackModule>
// NOT sure I can do this because I still would want to do WebpackModule.ANYTHING without having to cast
// the WebpackModule to any. ASK DEAN, perhaps there's something that could be done
export function remoteModuleResolver(resolverOptions: RemoteModuleResolverOptions): ResolveFn<any> {
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

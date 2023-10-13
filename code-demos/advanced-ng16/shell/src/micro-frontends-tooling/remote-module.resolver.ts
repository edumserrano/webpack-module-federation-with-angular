import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  RemoteModuleResultTypes,
  RemoteModuleService,
} from './remote-module.service';

export type remoteModuleResolverOptions = {
  remoteEntry: string;
  exposedModule: string;
};

// TODO: also add a note about the ResolveFn return type and how to pass router to the
// return function, see note about CanActivateFn on remoteModuleGuard
// export declare type ResolveFn<T> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T> | Promise<T> | T;

// TODO create a webpack module type that has nothing but it's used to help provide intent
// so instead ResolveFn<any> you would ResolveFn<WebpackModule>
// NOT sure I can do this because I still would want to do WebpackModule.ANYTHING without having to cast
// the WebpackModule to any. ASK DEAN, perhaps there's something that could be done
export function remoteModuleResolver(options: remoteModuleResolverOptions): ResolveFn<any> {
  return async (): Promise<any> => {
    const remoteModuleService = inject(RemoteModuleService);
    // TODO: the callback param is only needed because I'm using the service in multiple ways
    // this param could not be needed.
    const result = await remoteModuleService.loadAsync(
      options.exposedModule,
      options.remoteEntry,
    );

    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        return result.webpackModule;
      case RemoteModuleResultTypes.Failed:
        // TODO any note about this? or just delete?
        // const currentRoute = router.routerState;
        // const navOptions: NavigationBehaviorOptions = {
        //   skipLocationChange: true,
        // };
        // router.navigateByUrl(currentRoute.snapshot.url, navOptions);
        return null;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  };
}

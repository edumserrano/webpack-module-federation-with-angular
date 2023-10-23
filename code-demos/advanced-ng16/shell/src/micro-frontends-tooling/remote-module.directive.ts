import { AfterContentInit, Directive, Input } from '@angular/core';
import {
  RemoteModuleResult,
  RemoteModuleResultTypes,
  RemoteModuleService,
} from './remote-module.service';
import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';

export type RemoteModuleDirectiveOptions = LoadRemoteModuleOptions & {
  id: string;
};

// TODO: this directive can be used to load standalone, non-standalone/module,
// web component etc because the loadRemoteModuleCallback let's you do whatever code you want
@Directive({
  selector: '[remoteModule]',
  standalone: true,
})
export class RemoteModuleDirective implements AfterContentInit {
  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

  @Input({ required: true })
  public remoteModuleoptions!: RemoteModuleDirectiveOptions;

  @Input()
  public loadRemoteModuleCallback?: (webpackModule: any) => void | Promise<void>;

  public async ngAfterContentInit(): Promise<void> {
    // RemoteModuleDirectiveOptions type has the same shape as LoadRemoteModuleOptionsExtended
    // so I can just flow it into the remoteModuleService.loadAsync call
    const result: RemoteModuleResult = await this._remoteModuleService.loadAsync(this.remoteModuleoptions);
    switch (result.type) {
      case RemoteModuleResultTypes.Loaded:
        // if this.loadRemoteModuleCallback is not defined then use a callback function that does nothing
        const callback = this.loadRemoteModuleCallback ?? function (_: any): void {};
        await callback(result.webpackModule);
        break;
      case RemoteModuleResultTypes.Failed:
        break;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  }
}

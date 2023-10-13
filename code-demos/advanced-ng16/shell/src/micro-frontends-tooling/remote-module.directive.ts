import { AfterContentInit, Directive, Input } from '@angular/core';
import {
  RemoteModuleResult,
  RemoteModuleService,
} from './remote-module.service';

// TODO: this directive can be used to load standalone, non-standalone/module,
// web component etc because the loadRemoteModuleCallback let's you do whatever code you want
@Directive({
  selector: '[remoteModule]',
  standalone: true,
})
export class RemoteModuleDirective implements AfterContentInit {
  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

  @Input({ required: true })
  public remoteModuleId!: string;

  @Input({ required: true })
  public remoteEntry!: string;

  @Input({ required: true })
  public exposedModule!: string;

  @Input()
  public loadRemoteModuleCallback?: (webpackModule: any) => void | Promise<void>;

  public async ngAfterContentInit(): Promise<void> {
    // if this.loadRemoteModuleCallback is not defined then use a callback function that does nothing
    const callback = this.loadRemoteModuleCallback ?? function (_: any): void {};
    const _: RemoteModuleResult = await this._remoteModuleService.loadAsync(
      this.remoteModuleId,
      this.exposedModule,
      this.remoteEntry,
      callback,
    );
  }
}

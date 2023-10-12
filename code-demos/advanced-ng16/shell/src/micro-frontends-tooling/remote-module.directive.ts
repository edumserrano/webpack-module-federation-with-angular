import {
  RemoteModuleLoaded,
  RemoteModuleLoading,
  RemoteModuleFailed,
  RemoteModuleEvent,
} from './remote-module-events';
import {
  AfterContentInit,
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RemoteModuleResultTypes, RemoteModuleService } from './remote-module.service';

// TODO: this directive can be used to load standalone, non-standalone/module,
// web component etc because the loadRemoteModuleCallback let's you do whatever code you want
@Directive({
  selector: '[remoteModule]',
  standalone: true,
})
export class remoteModuleDirective implements AfterContentInit {

  public constructor(private readonly _remoteModuleService: RemoteModuleService) {}

  @Input({ required: true })
  public remoteEntry!: string;

  @Input({ required: true })
  public exposedModule!: string;

  @Input()
  public loadRemoteModuleCallback?: (webpackModule: any) => void | Promise<void>;

  @Output()
  public remoteModuleEvents: EventEmitter<RemoteModuleEvent> = new EventEmitter<RemoteModuleEvent>();

  public async ngAfterContentInit(): Promise<void> {
    this.triggerLoadingEvents();

    // if this.loadRemoteModuleCallback is not set then use a function that does nothing
    const callback = this.loadRemoteModuleCallback ?? function(_: any) { };
    const result = await this._remoteModuleService.load(
      this.exposedModule,
      this.remoteEntry,
      callback);
    switch(result.type) {
      case RemoteModuleResultTypes.Loaded:
        this.triggerLoadedEvents();
        break;
      case RemoteModuleResultTypes.Failed:
        this.triggerFailedEvents(result.error);
        break;
      default:
        // see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustiveCheck: never = result;
        return _exhaustiveCheck;
    }
  }

  private triggerLoadingEvents(): void {
    const event = new RemoteModuleLoading();
    this.remoteModuleEvents.emit(event);
  }

  private triggerLoadedEvents(): void {
    const event = new RemoteModuleLoaded();
    this.remoteModuleEvents.emit(event);
  }

  private triggerFailedEvents(error: Error): void {
    const event = new RemoteModuleFailed(error);
    this.remoteModuleEvents.emit(event);
  }
}

import { Component, EventEmitter, Input, OnInit, Output, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDestroy } from '@angular/core';

// The webpack configuration file at /component-standalone-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this Angular standalone component
@Component({
  selector: 'app-my-standalone-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-standalone-component.component.html',
  styleUrls: ['./my-standalone-component.component.css'],
})
export class MyStandaloneComponent implements OnDestroy, OnInit {

  public readonly version = VERSION.full;

  // demo input so that the shell can pass some data into the component
  @Input()
  public inputText?: string;

  // demo output event so that the component can notify the shell when
  // the component has been loaded
  //
  // We make this an async event by passing `true` to the constructor of `EventEmitter`
  // to avoid getting the following console error:
  //
  // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
  // See https://angular.io/errors/NG0100.
  //
  // This error happens because of three things:
  // 1) the shell will dynamically instante and add this component to the DOM which triggers Angular's change detection cycle.
  // 2) the loadedEvent is triggered from the OnInit lifecycle hook of this component
  // 3) the subscribe handler `onComponentLoaded` on the shell tries to update the `messageFromComponent` which is binded
  // to the view (app.component.html on the shell). This together with the the previous two steps, means that
  // we will be trying to update a property whilst we are in the middle of an Angular change detection cycle
  // and so we get the error.
  //
  // For more information read https://angularindepth.com/posts/1001/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error#dynamic-component-instantiation,
  // specially the `Dynamic component instantiation` section.
  @Output()
  public readonly loadedEvent: EventEmitter<string> = new EventEmitter<string>(true);

  // demo output event so that the component can notify the shell when
  // the component has been destroyed
  @Output()
  public readonly destroyedEvent: EventEmitter<string> = new EventEmitter<string>();

  public ngOnInit(): void {
    this.loadedEvent.emit('MyStandaloneComponent has been loaded.');
  }

  public ngOnDestroy(): void {
    this.destroyedEvent.emit('MyStandaloneComponent has been destroyed.');
  }
}

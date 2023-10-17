import { Component, ElementRef, EventEmitter, Output, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-standalone-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-standalone-component.component.html',
  styleUrls: ['./my-standalone-component.component.css']
})
export class MyStandaloneComponent {
  public readonly version = VERSION.full;

  public constructor(private readonly _elementRef: ElementRef) {}

  @Output()
  public messageSentEvent: EventEmitter<string> = new EventEmitter<string>();

  public sendMessage(): void {
    this.messageSentEvent.emit(`The time is ${new Date()}`);
  }
}


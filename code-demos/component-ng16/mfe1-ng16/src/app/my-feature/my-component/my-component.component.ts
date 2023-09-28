import { Component, Input, VERSION } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent {
  public readonly version = VERSION.full;

  @Input()
  public inputText?: string;
}

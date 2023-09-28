import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public readonly version: string = VERSION.full;
  public componentLoaded: boolean = false;

  public componentLoadedHandler(): void {
    this.componentLoaded = true;
  }

  public reload(): void {
    window.location.reload();
  }
}

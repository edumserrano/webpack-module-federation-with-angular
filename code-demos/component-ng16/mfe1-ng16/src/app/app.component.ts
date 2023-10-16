import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MyComponent } from './my-feature/my-component/my-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('mfe1', { read: ViewContainerRef, static: true })
  private readonly _viewContainerRef?: ViewContainerRef;

  public async ngOnInit(): Promise<void> {
    if(!this._viewContainerRef) {
      return;
    }

    this._viewContainerRef.clear();
    const componentRef: ComponentRef<MyComponent> = this._viewContainerRef.createComponent(MyComponent);
    componentRef.setInput("inputText", "test input value from dev platform");
  }
}

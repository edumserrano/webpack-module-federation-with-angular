import { Component } from '@angular/core';
import { MyComponent } from './my-feature/my-component/my-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // The routerActivateHandler method is being used to subscribe to the outputs
  // from the MyComponent when it's loaded into the router-outlet.
  //
  // This is not the usual way to subscribe to outputs from angular components.
  // The two most common ways are:
  // 1) on the HTML the parent component subscribes to the child component outputs.
  // 2) use an Angular service to pass data around.
  //
  // The second approach is what would normally be used for a situation where the
  // component is loaded using Angular routing. However, is this code demo the
  // MyComponent  is going to be remotely consumed by another app and we
  // don't want to expose any additional services with it.
  //
  // As such, to be able to subscribe to the outputs from the MyComponent
  // on the mfe dev platform without affecting the exposed component we are using the
  // activate event from the router-outlet.
  //
  // Based on the idea from https://chinedujude.medium.com/angular-emit-event-through-router-outlet-53b55fbd1f28
  //
  public routerActivateHandler(component: any): void {
    if(component instanceof MyComponent) {
      component.messageSentEvent.subscribe(x => console.log(x));
    }
  }

}

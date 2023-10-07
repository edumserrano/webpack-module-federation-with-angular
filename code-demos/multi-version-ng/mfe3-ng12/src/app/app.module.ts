import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyFeatureModule } from './my-feature/my-feature.module';
import { NgElementConfig, createCustomElement } from '@angular/elements';
import { MyComponent } from './my-feature/my-component/my-component.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, MyFeatureModule],
  providers: [],
  bootstrap: [],
})
export class AppModule {

  public constructor(
    private readonly _app: ApplicationRef,
    private readonly _injector: Injector,
  ) { }

  public ngDoBootstrap() : void {
    if(environment.bootstrapWebComponent) {
      const customElementName = "mfe3-element";
      this.bootstrapMyComponentAsWebComponent(customElementName);
    }
    else {
      this._app.bootstrap(AppComponent);
    }
  }

  public bootstrapMyComponentAsWebComponent(elementName: string) {
    const customElementConstructor: CustomElementConstructor | undefined = customElements.get(elementName);
    if(customElementConstructor) {
      return;
    }

    const ngElementConfig: NgElementConfig = {
      injector: this._injector
    };
    const myComponentAsCustomElement = createCustomElement(MyComponent, ngElementConfig);
    customElements.define(elementName, myComponentAsCustomElement);
  }
}

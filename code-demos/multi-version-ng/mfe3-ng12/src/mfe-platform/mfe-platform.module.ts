import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { NgElementConfig, createCustomElement } from '@angular/elements';
import { AppModule } from 'src/app/app.module';
import { MyComponent } from 'src/app/my-component/my-component.component';

@NgModule({
  declarations: [],
  imports: [AppModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [],
  // bootstrap: [MfeEntryComponent],
})
export class MfePlatformModule {

  public constructor(private readonly _injector: Injector) {}

  // TODO can I customize the element name somehow? test again passing some providers when bootstrapping the app
  public ngDoBootstrap() : void {
    const customElementName = "mfe3-element";
    this.bootstrapMyComponentAsWebComponent(customElementName);
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

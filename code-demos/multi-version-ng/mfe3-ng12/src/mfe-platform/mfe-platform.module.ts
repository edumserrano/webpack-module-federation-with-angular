import { Injector, NgModule } from '@angular/core';
import { NgElementConfig, createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { MyComponent } from 'src/app/my-component/my-component.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppModule],
  providers: [],
  // The bootstrap array below is empty because otherwise we would get the following
  // error https://stackoverflow.com/questions/55143772/error-expected-to-not-be-in-angular-zone-but-it-is
  // when the shell app is calling the `bootstrapMyComponentAsync` function from the
  // /mfe3-ng12/src/mfe-platform/remote-bootstrap.ts file.
  //
  // The components in the bootstrap array below will try to start Angular Zone.js,
  // but as the shell app is already running it, it throws an error.
  //
  bootstrap: [], // Usually it would be: `bootstrap: [MyComponent]`
})
export class MfePlatformModule {

  public constructor(private readonly _injector: Injector) {}

  // Because the `bootstrap` array on line 12 is empty, this `ngDoBootstrap` function
  // is called when the Angular platform is bootstraping this Module, which
  // happens:
  // - at /mfe3-ng12/bootstrap.ts: when running the `npm run start:mfe` command.
  // - at /mfe3-ng12/src/mfe-platform/remote-bootstrap.ts: when the shell is loading
  // this mfe by calling the `bootstrapMyComponentAsync` function.
  //
  // For more information about bootrapping Angular applications see:
  // - How to manually bootstrap an Angular application: https://medium.com/angular-in-depth/how-to-manually-bootstrap-an-angular-application-9a36ccf86429
  // - Ways of Bootstrapping Angular Applications: https://medium.com/learnwithrahul/ways-of-bootstrapping-angular-applications-d379f594f604
  //
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

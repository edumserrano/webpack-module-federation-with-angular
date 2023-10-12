import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { withRemoteModuleEventsHandler } from "src/micro-frontends-tooling/with-remote-module-events-handler";
import { withNavigationErrorHandler } from 'src/micro-frontends-tooling/with-navigation-error-handler';
import { RemoteModuleEvent } from 'src/micro-frontends-tooling/remote-module-events';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    withNavigationErrorHandler(error=> {
      // TODO use inject and call some service
      console.log(`nav error handler: `, error);

    }),
    withRemoteModuleEventsHandler((event: RemoteModuleEvent) => {
      // TODO use inject and call some service
      console.log(`remote module events: `, event);
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

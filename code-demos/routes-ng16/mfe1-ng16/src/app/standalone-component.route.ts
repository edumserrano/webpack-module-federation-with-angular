import { Route } from '@angular/router';
import { MyStandaloneComponent } from './my-standalone-component/my-standalone-component.component';
import { AnotherStandaloneComponent } from './another-standalone-component/another-standalone-component.component';

// The webpack configuration file at /routes-ng16/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this Angular routes array
export const STANDALONE_COMPONENTS_ROUTES: Route[] = [
  {
    path: 'my',
    component: MyStandaloneComponent,
  },
  {
    path: 'another',
    component: AnotherStandaloneComponent,
  },
];

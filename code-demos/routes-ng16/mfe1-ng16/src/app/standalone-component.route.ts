import { Route } from '@angular/router';
import { MyStandaloneComponent } from './my-standalone-component/my-standalone-component.component';
import { AnotherStandaloneComponent } from './another-standalone-component/another-standalone-component.component';

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

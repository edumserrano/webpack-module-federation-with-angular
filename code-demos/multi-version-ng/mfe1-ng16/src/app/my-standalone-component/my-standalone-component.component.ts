import { Component, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

// The webpack configuration file at /multi-version-ng/mfe1-ng16/webpack.config.js
// exposes a webpack module which contains this Angular standalone component
@Component({
  selector: 'app-my-standalone-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-standalone-component.component.html',
  styleUrls: ['./my-standalone-component.component.css'],
})
export class MyStandaloneComponent {
  version = VERSION.full;
}

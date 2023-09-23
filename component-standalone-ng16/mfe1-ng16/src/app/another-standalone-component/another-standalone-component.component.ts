import { Component, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-another-standalone-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './another-standalone-component.component.html',
  styleUrls: ['./another-standalone-component.component.css']
})
export class AnotherStandaloneComponent {
  version = VERSION.full;
}

import { Component, OnInit } from '@angular/core';
import { bootstrapMyComponentAsync } from './my-standalone-component/my-standalone-component-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public async ngOnInit(): Promise<void> {
    await bootstrapMyComponentAsync();
  }

}

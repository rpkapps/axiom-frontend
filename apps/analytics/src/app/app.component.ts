import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'lx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
  ngDoCheck() {
    // console.log('CHANGE DETECTION');
  }
}

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lx-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

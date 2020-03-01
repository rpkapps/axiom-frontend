import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lx-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

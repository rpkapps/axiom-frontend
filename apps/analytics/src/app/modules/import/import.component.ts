import { Component, OnInit } from '@angular/core';
import { ImportService } from './import.service';

@Component({
  selector: 'lx-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: [ImportService]
})
export class ImportComponent implements OnInit {
  constructor(public importService: ImportService) { }

  ngOnInit(): void {
  }
}

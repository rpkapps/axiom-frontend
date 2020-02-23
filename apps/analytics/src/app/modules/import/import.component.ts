import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ImportService } from './import.service';

@Component({
  selector: 'lx-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less'],
  providers: [ImportService]
})
export class ImportComponent implements OnInit {
  modalOpen = true;

  constructor(
    public importService: ImportService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {}
}

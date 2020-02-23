import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';
import { ImportService } from './import.service';

@Component({
  selector: 'lx-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: [ImportService]
})
export class ImportComponent implements OnInit {
  @ViewChild('dialogTemplate', { static: true, read: TemplateRef }) dialogTemplate: TemplateRef<any>;
  private _dialogRef: MatDialogRef<any>;

  constructor(
    public importService: ImportService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.openDialog();
  }

  openDialog() {
    this._dialogRef = this._dialog.open(this.dialogTemplate, {
      width: '1000px',
      disableClose: true
    });
  }
}

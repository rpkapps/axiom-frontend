import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFile } from '@axiom/infrastructure';
import { AppService } from '../../../../app.service';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFileComponent {

  constructor(
    public importService: ImportService,
    public appService: AppService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  trackByFileId(index: number, file: IFile) {
    return file.FileId;
  }

  onFileClick(file: IFile) {
    this.importService.selectedFile = file;
    this.importService.analyzeOptions.FileId = file.FileId;
    this._router.navigate(['../settings'], { relativeTo: this._route });
  }
}

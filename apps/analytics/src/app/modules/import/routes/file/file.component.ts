import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFile } from '@axiom/infrastructure';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  trackByFileId(index: number, file: IFile) {
    return file.FileId;
  }

  onFileClick(file: IFile) {
    this.importService.options.FileId = file.FileId;
    this._router.navigate(['../settings'], { relativeTo: this._route });
  }
}

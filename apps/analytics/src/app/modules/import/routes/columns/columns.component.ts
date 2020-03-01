import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.importService.previewFile();
  }

  onBackClick() {
    this._router.navigate(['../index'], { relativeTo: this._route });
  }

  onNextClick() {
    this._router.navigate(['../tags'], { relativeTo: this._route });
  }
}

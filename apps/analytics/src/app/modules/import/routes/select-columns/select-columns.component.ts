import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-select-columns',
  templateUrl: './select-columns.component.html',
  styleUrls: ['./select-columns.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectColumnsComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.importService.previewFile();
  }

  onBackClick() {
    this._router.navigate(
      [this.importService.skipSelectIndexStep ? '../settings' : '../index'],
      { relativeTo: this._route }
    );
  }

  onNextClick() {
    this._router.navigate(['../tags'], { relativeTo: this._route });
  }
}

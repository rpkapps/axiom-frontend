import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-select-index',
  templateUrl: './select-index.component.html',
  styleUrls: ['./select-index.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectIndexComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    if (this.importService.skipSelectIndexStep) {
      this.onNextClick();
    } else {
      this.importService.previewFile();
    }
  }

  onBackClick() {
    this._router.navigate(['../settings'], { relativeTo: this._route });
  }

  onNextClick() {
    this._router.navigate(['../columns'], { relativeTo: this._route });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.importService.previewFile();
  }

  onBackClick() {
    this._router.navigate(['../settings'], { relativeTo: this._route });
  }

  onNextClick() {
    this._router.navigate(['../columns'], { relativeTo: this._route });
  }
}

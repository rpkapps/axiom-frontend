import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTagsComponent {
  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  get columnsToShow() {
    const {IndexColumns, DataColumns} = this.importService.options;
    return [...(IndexColumns || []), ...(DataColumns || [])];
  }

  onBackClick() {
    this._router.navigate(['../columns'], { relativeTo: this._route });
  }
}

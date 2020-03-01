import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  onBackClick() {
    this._router.navigate(['../columns'], { relativeTo: this._route });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  onBackClick() {
    this._router.navigate(['../file'], { relativeTo: this._route });
  }

  onFormSubmit() {
    this._router.navigate(['../index'], { relativeTo: this._route });
    return false;
  }
}

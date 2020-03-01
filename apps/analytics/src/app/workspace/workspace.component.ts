import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'lx-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent {
  constructor(
    public appService: AppService,
    private _route: ActivatedRoute
  ) {
    this.appService.workspaceId = this._route.snapshot.paramMap.get('workspaceId');
  }
}

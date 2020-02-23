import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'lx-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent implements OnInit {
  constructor(
    public appService: AppService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.appService.workspaceId = this._route.snapshot.paramMap.get('workspaceId');
  }
}

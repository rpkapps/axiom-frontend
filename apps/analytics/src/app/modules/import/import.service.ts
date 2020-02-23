import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationService, IStatus } from '@axiom/infrastructure';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { IAnalysisError, IAnalyzeResponse, IFile, IFilePreview, IImportOptions } from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  options: IImportOptions = {} as IImportOptions;

  files$ = new BehaviorSubject<IFile[]>(null);
  filePreview$ = new BehaviorSubject<IFilePreview>(null);
  analyzeResponse$ = new BehaviorSubject<IAnalyzeResponse>(null);

  constructor(
    private _com: CommunicationService,
    private _appService: AppService
  ) {
    this.subscribeToAnalyze();
  }

  getFiles() {
    this._com
      .sendQuery<IFile[]>({
        Key: 'List',
        CollectionKey: 'File',
        FilterKey: 'WorkspaceId',
        FilterValue: this._appService.workspaceId
      })
      .then(files => this.files$.next(files));
  }

  previewFile() {
    this._com
      .sendQuery<string[][]>({
        Key: 'PreviewFile',
        FileId: this.options.FileId
      })
      .then(preview => {
        this.filePreview$.next({ Preview: preview });
      })
      .catch(() => {
        this.filePreview$.next({ Error: 'Failed to preview file.' })
      });
  }

  analyzeFile() {
    this._com
      .sendCommand({
        Key: 'AnalyzeFile',
        WorkspaceId: this._appService.workspaceId,
        FileId: this.options.FileId,
        IndexColumn: this.options.IndexColumn,
        DataColumns: this.options.DataColumns,
        DataTypeId: this.options.DataTypeId,
        TimeTypeId: this.options.TimeTypeId,
        EmptyValue: this.options.EmptyValue,
      })
      .catch(() => {
        this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
      });
  }

  ngOnDestroy() {}

  private subscribeToAnalyze() {
    this._com.notification$
      .pipe(
        filter(s =>
          s.Key === 'Status'
          && s.Command.Key === 'AnalyzeFile'
          && s.Command.FileId === this.options.FileId
        ),
        untilDestroyed(this)
      )
      .subscribe((status: IStatus) => {
        switch (status.State) {
          case 'InProgress':
            this.analyzeResponse$.next({ Progress: status.Progress });
            break;
          case 'Completed':
            this._com
              .sendQuery<IAnalysisError[]>(status.ResultQuery)
              .then(analysis => {
                this.analyzeResponse$.next({ Analysis: analysis });
              })
              .catch(() => {
                this.analyzeResponse$.next({ Error: 'Failed to load analysis.' });
              });
            break;
          case 'Failed':
            this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
        }
      });
  }
}

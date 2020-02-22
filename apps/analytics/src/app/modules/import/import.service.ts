import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationService, IStatus } from '@axiom/infrastructure';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IAnalysisError, IAnalyzeResponse, IFile, IFilePreview, IImportOptions } from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  options: IImportOptions = {} as IImportOptions;

  files$ = new BehaviorSubject<IFile[]>(null);
  filePreview$ = new BehaviorSubject<IFilePreview>(null);
  analyzeResponse$ = new BehaviorSubject<IAnalyzeResponse>(null);

  constructor(private _com: CommunicationService) {
    this.subscribeToAnalyze();
  }

  getFiles() {
    this._com
      .sendQuery<IFile[]>({
        Key: 'List',
        ListKey: 'File'
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
        FileId: this.options.FileId,
        IndexColumn: this.options.IndexColumn,
        DataColumns: this.options.DataColumns,
        Transposed: this.options.Transposed,
        DataTypeId: this.options.DataTypeId
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
          && s.CommandKey === 'AnalyzeFile'
          && s.FileId === this.options.FileId
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

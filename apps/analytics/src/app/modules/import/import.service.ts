import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationService, IFile, IStatus } from '@axiom/infrastructure';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppService } from '../../app.service';
import {
  IAnalysisError, IAnalyzeResponse, IDataType, IFilePreview, IImportOptions, ITagGroup, ITimeType
} from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  options: IImportOptions = {} as IImportOptions;

  files$: Observable<IFile[]>;
  dataTypes$ = new BehaviorSubject<IDataType[]>(null);
  timeTypes$ = new BehaviorSubject<ITimeType[]>(null);
  filePreview$ = new BehaviorSubject<IFilePreview>(null);
  analyzeResponse$ = new BehaviorSubject<IAnalyzeResponse>(null);
  tagGroup$ = new BehaviorSubject<ITagGroup>(null);

  private _files$ = new BehaviorSubject<IFile[]>(null);

  constructor(
    private _comService: CommunicationService,
    private _appService: AppService
  ) {
    this.subscribeToAnalyze();

    this.files$ = merge(
      this._files$,
      this._appService.uploads$,
    );
  }

  getFiles() {
    this._comService
      .sendQuery<IFile[]>({
        Key: 'List',
        CollectionKey: 'File',
        FilterKey: 'WorkspaceId',
        FilterValue: this._appService.workspaceId
      })
      .then(files => {
        this._files$.next(files)
      });
  }

  getDataTypes() {
    this._comService
      .sendQuery<IDataType[]>({
        Key: 'List',
        CollectionKey: 'DataType'
      })
      .then(dataTypes => {
        this.dataTypes$.next(dataTypes)
      });
  }

  getTimeTypes() {
    this._comService
      .sendQuery<ITimeType[]>({
        Key: 'List',
        CollectionKey: 'TimeType'
      })
      .then(timeTypes => {
        this.timeTypes$.next(timeTypes)
      });
  }

  previewFile() {
    this._comService
      .sendQuery<string[][]>({
        Key: 'PreviewFile',
        FileId: this.options.FileId
      })
      .then(preview => {
        this.filePreview$.next({ Preview: preview })
      })
      .catch(() => {
        this.filePreview$.next({ Error: 'Failed to preview file.' })
      });
  }

  analyzeFile() {
    this._comService
      .sendCommand({
        ...this.options,
        Key: 'AnalyzeFile',
      })
      .catch(() => {
        this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
      });
  }

  getTagGroup() {
    this._comService
      .sendQuery<ITagGroup>({
        Key: 'Object',
        CollectionKey: 'TagGroup',
        IdKey: 'TagGroupId',
        IdValue: this.options.DataTypeId
      })
      .then(tagGroup => {
        this.tagGroup$.next(tagGroup)
      });
  }

  importFile() {
    this._comService
      .sendCommand({
        ...this.options,
        Key: 'ImportFile'
      })
      .catch(() => {
        // TODO RK: Notify user of error
      });
  }

  ngOnDestroy() {}

  private subscribeToAnalyze() {
    this._comService.notification$
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
            this._comService
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

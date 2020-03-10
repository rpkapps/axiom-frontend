import { Injectable, OnDestroy } from '@angular/core';
import {
  ApiService, IFile, IStatus, NotificationService, objectsEqual, removeFromArrayByValue, StorageService
} from '@axiom/infrastructure';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AppService } from '../../app.service';
import {
  IAnalysisError, IAnalyzeOptions, IAnalyzeResponse, IDataType, IFilePreview, IImportOptions, ITagGroup, ITimeType
} from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  selectedFile: IFile;
  analyzeOptions: IAnalyzeOptions = {} as IAnalyzeOptions;
  importOptions: IImportOptions = {} as IImportOptions;

  files$: Observable<IFile[]>;
  filePreview$ = new BehaviorSubject<IFilePreview>(null);
  analyzeResponse$ = new BehaviorSubject<IAnalyzeResponse>(null);

  dataTypes$ = this._apiService
    .sendQuery<IDataType[]>({
      Key: 'List',
      CollectionKey: 'DataType'
    })
    .pipe(
      tap(dataTypes =>
        this.analyzeOptions.DataTypeId = this.analyzeOptions.DataTypeId ?? dataTypes[0]?.DataTypeId
      )
    );

  timeTypes$ = this._apiService
    .sendQuery<ITimeType[]>({
      Key: 'List',
      CollectionKey: 'TimeType'
    })
    .pipe(
      tap(timeTypes =>
        this.analyzeOptions.TimeTypeId = this.analyzeOptions.TimeTypeId ?? timeTypes[0]?.TimeTypeId
      )
    );

  tagGroup$ = this._apiService
    .sendQuery<ITagGroup>({
      Key: 'Object',
      CollectionKey: 'TagGroup',
      IdKey: 'TagGroupId',
      IdValue: this.analyzeOptions.DataTypeId
    });

  private _analyzeTransactionId: string;
  private _sentAnalyzeOptions: IAnalyzeOptions;
  private _sentPreviewFileId: string;

  constructor(
    private _storageService: StorageService,
    private _apiService: ApiService,
    private _notificationService: NotificationService,
    private _appService: AppService
  ) {
    this._subscribeToAnalyze();

    const files$ = this._apiService
      .sendQuery<IFile[]>({
        Key: 'List',
        CollectionKey: 'File',
        FilterKey: 'WorkspaceId',
        FilterValue: this._appService.workspaceId
      });

    this.files$ = combineLatest([files$, this._appService.uploads$])
      .pipe(
        map(([a, b]) => {
          return [...a, ...b];
        })
      );
  }

  previewFile() {
    if (this.analyzeOptions.FileId === this._sentPreviewFileId) {
      return;
    }

    this._sentPreviewFileId = this.analyzeOptions.FileId;

    this._apiService
      .sendQuery<string[][]>({
        Key: 'PreviewFile',
        FileId: this.analyzeOptions.FileId
      })
      .toPromise()
      .then(preview => {
        this.filePreview$.next({ Preview: preview });
      })
      .catch(() => {
        this.filePreview$.next({ Error: 'Failed to preview file.' });
        this._sentPreviewFileId = null;
      });
  }

  analyzeFile() {
    if (objectsEqual(this.analyzeOptions, this._sentAnalyzeOptions)) {
      return;
    }

    if (this._analyzeTransactionId) {
      this._apiService
        .sendCommand({
          Key: 'Cancel',
          CommandId: this._analyzeTransactionId
        });
    }

    this._cleanAnalyzeOptions();
    this._sentAnalyzeOptions = { ...this.analyzeOptions };

    this._apiService
      .sendCommand({
        ...this.analyzeOptions,
        Key: 'AnalyzeFile'
      })
      .toPromise()
      .then(command => this._analyzeTransactionId = command.TransactionId)
      .catch(() => {
        this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
        this._sentAnalyzeOptions = null;
      });
  }

  importFile() {
    this._apiService
      .sendCommand({
        ...this.importOptions,
        Key: 'ImportFile',
        WorkspaceId: this._appService.workspaceId
      })
      .toPromise()
      .catch(() => {
        // TODO RK: Notify user of error
      });
  }

  ngOnDestroy() {}

  private _cleanAnalyzeOptions() {
    this.analyzeOptions.IndexColumns?.forEach(indexColumn => {
      removeFromArrayByValue(this.analyzeOptions.DataColumns, indexColumn);
    });
  }

  private _subscribeToAnalyze() {
    this._notificationService.$
      .pipe(
        filter(notification =>
          notification.Key === 'Status' &&
          notification.Command.TransactionId === this._analyzeTransactionId
        ),
        untilDestroyed(this)
      )
      .subscribe((status: IStatus) => {
        switch (status.State) {
          case 'InProgress':
            this.analyzeResponse$.next({ Progress: status.Progress });
            break;
          case 'Completed':
            this._apiService
              .sendQuery<IAnalysisError[]>(status.ResultQuery)
              .toPromise()
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

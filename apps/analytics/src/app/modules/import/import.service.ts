import { Injectable, OnDestroy } from '@angular/core';
import { ApiService, IFile, IStatus, NotificationService, objectsEqual, StorageService } from '@axiom/infrastructure';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppService } from '../../app.service';
import {
  IAnalysisError, IAnalyzeOptions, IAnalyzeResponse, IDataType, IFilePreview, IImportOptions, ITagGroup, ITimeType
} from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  analyzeOptions: IAnalyzeOptions = {} as IAnalyzeOptions;
  importOptions: IImportOptions = {} as IImportOptions;

  files$: Observable<IFile[]>;
  dataTypes$ = new BehaviorSubject<IDataType[]>(null);
  timeTypes$ = new BehaviorSubject<ITimeType[]>(null);
  filePreview$ = new BehaviorSubject<IFilePreview>(null);
  analyzeResponse$ = new BehaviorSubject<IAnalyzeResponse>(null);
  tagGroup$ = new BehaviorSubject<ITagGroup>(null);

  private _files$ = new BehaviorSubject<IFile[]>([]);
  private _analyzeTransactionId: string;
  private _sentAnalyzeOptions: IAnalyzeOptions;

  constructor(
    private _storageService: StorageService,
    private _apiService: ApiService,
    private _notificationService: NotificationService,
    private _appService: AppService
  ) {
    this._subscribeToAnalyze();

    this.files$ = combineLatest([this._files$, this._appService.uploads$])
      .pipe(
        map(([a, b]) => {
          return [...a, ...b];
        })
      );

    this.getFiles();
    this.getDataTypes();
    this.getTimeTypes();
  }

  getFiles() {
    this._apiService
      .sendQuery<IFile[]>({
        Key: 'List',
        CollectionKey: 'File',
        FilterKey: 'WorkspaceId',
        FilterValue: this._appService.workspaceId
      })
      .then(files => {
        const fruits = ['Açaí', 'Akee', 'Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Black sapote', 'Blueberry', 'Boysenberry', 'Cactus pear', 'Crab apple', 'Currant', 'Cherry', 'Chico fruit', 'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava'];
        const fruitFiles = fruits.map(fruit => <IFile> {
          FileName: fruit + '.csv',
          FileId: fruit,
          WorkspaceId: 'workspace'
        });
        this._files$.next([...files, ...fruitFiles]);
      });
  }

  getDataTypes() {
    this._apiService
      .sendQuery<IDataType[]>({
        Key: 'List',
        CollectionKey: 'DataType'
      })
      .then(dataTypes => {
        this.dataTypes$.next(dataTypes);
      });
  }

  getTimeTypes() {
    this._apiService
      .sendQuery<ITimeType[]>({
        Key: 'List',
        CollectionKey: 'TimeType'
      })
      .then(timeTypes => {
        this.timeTypes$.next(timeTypes);
      });
  }

  previewFile() {
    this._apiService
      .sendQuery<string[][]>({
        Key: 'PreviewFile',
        FileId: this.analyzeOptions.FileId
      })
      .then(preview => {
        this.filePreview$.next({ Preview: preview });
      })
      .catch(() => {
        this.filePreview$.next({ Error: 'Failed to preview file.' });
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

    this._sentAnalyzeOptions = { ...this.analyzeOptions };

    this._apiService
      .sendCommand({
        ...this.analyzeOptions,
        Key: 'AnalyzeFile'
      })
      .then(command => this._analyzeTransactionId = command.TransactionId)
      .catch(() => {
        this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
        this._sentAnalyzeOptions = null;
      });
  }

  getTagGroup() {
    this._apiService
      .sendQuery<ITagGroup>({
        Key: 'Object',
        CollectionKey: 'TagGroup',
        IdKey: 'TagGroupId',
        IdValue: this.analyzeOptions.DataTypeId
      })
      .then(tagGroup => {
        this.tagGroup$.next(tagGroup);
      });
  }

  importFile() {
    this._apiService
      .sendCommand({
        ...this.importOptions,
        Key: 'ImportFile',
        WorkspaceId: this._appService.workspaceId
      })
      .catch(() => {
        // TODO RK: Notify user of error
      });
  }

  ngOnDestroy() {}

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

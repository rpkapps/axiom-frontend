import { Injectable, OnDestroy } from '@angular/core';
import { ApiService, IFile, IStatus, StorageService } from '@axiom/infrastructure';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  private _files$ = new BehaviorSubject<IFile[]>([]);

  constructor(
    private _storageService: StorageService,
    private _apiService: ApiService,
    private _appService: AppService
  ) {
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
      .toPromise()
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
      .toPromise()
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
      .toPromise()
      .then(timeTypes => {
        this.timeTypes$.next(timeTypes);
      });
  }

  previewFile() {
    this._apiService
      .sendQuery<string[][]>({
        Key: 'PreviewFile',
        FileId: this.options.FileId
      })
      .toPromise()
      .then(preview => {
        this.filePreview$.next({ Preview: preview });
      })
      .catch(() => {
        this.filePreview$.next({ Error: 'Failed to preview file.' });
      });
  }

  analyzeFile() {
    this._apiService
      .sendCommandAndListen({
        ...this.options,
        Key: 'AnalyzeFile'
      })
      .subscribe(
        (status: IStatus<IAnalysisError[]>) => {
          switch (status.State) {
            case 'InProgress':
              this.analyzeResponse$.next({ Progress: status.Progress });
              break;
            case 'Completed':
              this.analyzeResponse$.next({ Analysis: status.Result });
              break;
            case 'Failed':
              this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
          }
        },
        error => {
          this.analyzeResponse$.next({ Error: 'Failed to analyze file.' });
        }
      );
  }

  getTagGroup() {
    this._apiService
      .sendQuery<ITagGroup>({
        Key: 'Object',
        CollectionKey: 'TagGroup',
        IdKey: 'TagGroupId',
        IdValue: this.options.DataTypeId
      })
      .toPromise()
      .then(tagGroup => {
        this.tagGroup$.next(tagGroup);
      });
  }

  importFile() {
    this._apiService
      .sendCommand({
        ...this.options,
        Key: 'ImportFile',
        WorkspaceId: this._appService.workspaceId
      })
      .toPromise()
      .catch(() => {
        // TODO RK: Notify user of error
      });
  }

  ngOnDestroy() {}
}

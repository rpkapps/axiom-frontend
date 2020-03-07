import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as msgpack5 from 'msgpack5';
import { asyncScheduler, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, throttleTime } from 'rxjs/operators';
import { config, ICommand, IFile, IQuery, IStatus } from '../symbols';
import { NotificationService } from './notification.service';

const { encode, decode } = msgpack5();

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private _http: HttpClient,
    private _notificationService: NotificationService
  ) {}

  sendCommand(command: ICommand) {
    return this._post<ICommand>(`${ config.ApiUrl }/command`, command);
  }

  sendCommandAndListen(command: ICommand) {
    return this._queryResult(this._returnStatus(this.sendCommand(command)));
  }

  sendQuery<T>(query: IQuery) {
    return this._post<T>(`${ config.ApiUrl }/query`, query);
  }

  upload(workspaceId: string, file: File) {
    const formData = new FormData();
    formData.set('File', file);
    formData.set('WorkspaceId', workspaceId);

    const response = <IFile> {
      FileId: null,
      FileName: file.name,
      WorkspaceId: workspaceId,
      Progress: 0,
      Status: 'Uploading'
    };

    return this._http
      .post(
        `${ config.ApiUrl }/upload`,
        formData,
        { responseType: 'arraybuffer', observe: 'events' }
      )
      .pipe(
        filter(event =>
          event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.Response
        ),
        // Throttle to prevent choppy progress animations
        throttleTime(250, asyncScheduler, { trailing: true }),
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            response.Progress = Math.floor(event.loaded * 100 / event.total);
          } else {
            const body = decode(event.body) as IFile;
            response.FileId = body.FileId;
            response.Status = 'Done';
            response.Progress = 100;
          }
          return response;
        }),
        catchError(() => {
          response.Status = 'Error';
          return of(response);
        })
      );
  }

  private _returnStatus(command$: Observable<ICommand>) {
    return command$.pipe(
      mergeMap(response => {
        return this._notificationService.$.pipe(
          filter(notification =>
            notification.Key === 'Status' &&
            notification.Command.TransactionId === response.TransactionId
          )
        );
      })
    ) as Observable<IStatus>;
  }

  private _queryResult(status$: Observable<IStatus>) {
    return status$.pipe(
      mergeMap(status => {
        if (status.State === 'Completed' && status.ResultQuery) {
          return this.sendQuery(status.ResultQuery)
            .pipe(
              map(result => {
                status.Result = result;
                return status;
              })
            );
        } else {
          return of(status);
        }
      })
    );
  }

  private _post<T>(url: string, body: any) {
    const buffer = encode(body).buffer as ArrayBufferLike;

    return this._http.post(url, buffer, { responseType: 'arraybuffer' })
      .pipe(map(bytes => decode(bytes) as T));
  }
}

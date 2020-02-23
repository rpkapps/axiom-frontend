import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { asyncScheduler, of, Subject } from 'rxjs';
import { catchError, filter, map, throttleTime } from 'rxjs/operators';
import { ICommand, IConfig, INotification, IQuery, IUploadResponse } from './symbols';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  config: IConfig;
  private _notification$ = new Subject<INotification>();
  notification$ = this._notification$.asObservable();

  private _retryTime = 10000;

  constructor(
    private _http: HttpClient,
    private _ngZone: NgZone
  ) { }

  init() {
    return this.loadConfig().then(() => this.startHubConnection());
  }

  sendCommand(command: ICommand) {
    return this._http.post<ICommand>(`${ this.config.ApiUrl }/command`, command).toPromise();
  }

  sendQuery<T>(query: IQuery) {
    return this._http.post<T>(`${ this.config.ApiUrl }/query`, query).toPromise();
  }

  upload(workspaceId: string, file: File) {
    const formData = new FormData();
    formData.set('File', file);
    formData.set('WorkspaceId', workspaceId);

    const response = <IUploadResponse> {
      FileId: null,
      FileName: file.name,
      Size: file.size,
      Type: file.type,
      Progress: 0,
      BytesLoaded: 0,
      StatusText: ''
    };

    return this._http.post(`${ this.config.ApiUrl }/upload`, formData, {
      observe: 'events',
      reportProgress: true,
      responseType: 'json'
    }).pipe(
      filter(event =>
        event.type === HttpEventType.UploadProgress ||
        event.type === HttpEventType.Response
      ),
      // Throttle to prevent choppy progress animations
      throttleTime(250, asyncScheduler, { trailing: true }),
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          response.Status = 'uploading';
          response.BytesLoaded = event.loaded;
          response.Progress = Math.floor(event.loaded * 100 / event.total);
        } else {
          response.FileId = event.body.FileId;
          response.Status = 'done';
          response.BytesLoaded = file.size;
          response.Progress = 100;
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        response.Status = 'error';
        response.StatusText = error.statusText;
        return of(response);
      })
    );
  }

  private loadConfig() {
    return this._http.get<IConfig>('/assets/config.json')
      .toPromise()
      .then(config => this.config = config);
  }

  private startHubConnection(): Promise<void> {
    return this._ngZone.runOutsideAngular(() => {
      const connection = new HubConnectionBuilder()
        .withUrl(this.config.SignalRUrl)
        .build();

      const reconnect = () => {
        const handle = setInterval(() => {
          connection
            .start()
            .then(() => clearInterval(handle))
            .catch(e => {});
        }, this._retryTime);
      };

      connection.onclose(() => reconnect());
      connection.on('Notify', data => {
        this._ngZone.run(() => this._notification$.next(data));
      });

      return connection
        .start()
        .catch(() => reconnect());
    });
  }
}

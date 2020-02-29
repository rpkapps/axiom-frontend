import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { asyncScheduler, of, Subject } from 'rxjs';
import { catchError, filter, map, tap, throttleTime } from 'rxjs/operators';
import { HttpMessagePackService } from './http-message-pack.service';
import { ICommand, IConfig, IFile, INotification, IQuery } from './symbols';

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
    private _httpMessagePack: HttpMessagePackService,
    private _ngZone: NgZone
  ) {}

  init() {
    return this.loadConfig()
      .then(() => {
        this.startHubConnection();
        return true;
      });
  }

  sendCommand(command: ICommand) {
    return this._httpMessagePack
      .post<ICommand>(`${ this.config.ApiUrl }/command`, command)
      .pipe(tap(p => console.log(p)))
      .toPromise();
  }

  sendQuery<T>(query: IQuery) {
    return this._httpMessagePack
      .post<T>(`${ this.config.ApiUrl }/query`, query)
      .pipe(tap(p => console.log(p)))
      .toPromise();
  }

  upload(workspaceId: string, file: File) {
    const formData = new FormData();
    formData.set('File', file);
    formData.set('WorkspaceId', workspaceId);

    const response = <IFile> {
      FileId: null,
      FileName: file.name,
      Progress: 0,
      Status: 'Uploading'
    };

    return this._httpMessagePack
      .post(`${ this.config.ApiUrl }/upload`, formData, {
        observe: 'events',
        reportProgress: true
      })
      .pipe(
        filter(event =>
          event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.Response
        ),
        // Throttle to prevent choppy progress animations
        throttleTime(250, asyncScheduler, { trailing: true }),
        map((event: any) => {
          console.log(event);
          if (event.type === HttpEventType.UploadProgress) {
            response.Status = 'Uploading';
            response.Progress = Math.floor(event.loaded * 100 / event.total);
          } else {
            response.FileId = event.body.FileId;
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

  private loadConfig() {
    return this._http.get<IConfig>('/assets/config.json')
      .toPromise()
      .then(config => this.config = config);
  }

  private startHubConnection(): Promise<void> {
    return this._ngZone.runOutsideAngular(() => {
      const connection = new HubConnectionBuilder()
        .withUrl(this.config.SignalRUrl)
        .withHubProtocol(new MessagePackHubProtocol())
        .build();

      const reconnect = () => {
        const handle = setInterval(() => {
          connection
            .start()
            .then(() => clearInterval(handle))
            .catch(() => {});
        }, this._retryTime);
      };

      connection.onclose(() => reconnect());
      connection.on('Notify', data => {
        console.log('Notify', JSON.parse(JSON.stringify(data)));
        this._ngZone.run(() => this._notification$.next(data));
      });

      return connection
        .start()
        .catch(() => reconnect());
    });
  }
}

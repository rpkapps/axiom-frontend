import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, of } from 'rxjs';
import { catchError, filter, map, throttleTime } from 'rxjs/operators';
import { generateId } from '../../utilities';
import { ICommand, IConfig, IQuery, IUploadResponse } from './symbols';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  config: IConfig;

  constructor(
    private _http: HttpClient
  ) { }

  loadConfig() {
    return this._http.get<IConfig>('/assets/config.json')
      .toPromise()
      .then(config => {
        this.config = config;
        return true;
      });
  }

  sendCommand(command: ICommand) {
    return this._http.post<ICommand>(`${ this.config.ApiUrl }/Command`, command);
  }

  sendQuery(query: IQuery) {
    return this._http.post<ICommand>(`${ this.config.ApiUrl }/Query`, query);
  }

  upload(file: File) {
    const fileId = generateId();
    const formData = new FormData();
    formData.set('File', file, fileId);

    const response = <IUploadResponse> {
      FileId: fileId,
      Name: file.name,
      Size: file.size,
      Type: file.type,
      Progress: 0,
      BytesLoaded: 0,
      StatusText: ''
    };

    return this._http.post(`${ this.config.ApiUrl }/Upload`, formData, {
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
}

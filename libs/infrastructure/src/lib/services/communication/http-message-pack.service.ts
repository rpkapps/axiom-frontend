import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as msgpack5 from 'msgpack5';
import { map } from 'rxjs/operators';

const { encode, decode } = msgpack5();

@Injectable({
  providedIn: 'root'
})
export class HttpMessagePackService {

  constructor(private _http: HttpClient) {}

  post<T>(url: string, body: any, options: IMessagePackPost = {}) {
    const buffer = encode(body).buffer as ArrayBufferLike;

    if (options.observe === 'events') {
      return this._http
        .post(url, buffer, { ...options, responseType: 'arraybuffer', observe: 'events' })
        .pipe(
          map(event => {
            return event.type === HttpEventType.Response
              ? event.clone({ body: decode(event.body) })
              : event;
          })
        );
    } else {
      return this._http
        .post(url, buffer, { ...options, responseType: 'arraybuffer', observe: 'body' })
        .pipe(map(bytes => decode(bytes)));
    }
  }
}

interface IMessagePackPost {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'events' | 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

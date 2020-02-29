import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subject } from 'rxjs';
import { config, INotification } from '../symbols';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _retryTime = 10000;

  private _notification$ = new Subject<INotification>();
  $ = this._notification$.asObservable();

  constructor(private _ngZone: NgZone) {}

  startHubConnection(): Promise<void> {
    return this._ngZone.runOutsideAngular(() => {
      const connection = new HubConnectionBuilder()
        .withUrl(config.SignalRUrl)
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

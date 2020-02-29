import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config, IConfig } from '../symbols';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class InitializerService {
  constructor(
    private _http: HttpClient,
    private _notificationService: NotificationService
  ) {}

  initialize() {
    return this.loadConfig().then(() => {
      this._notificationService.startHubConnection();
      return true;
    });
  }

  private loadConfig() {
    return this._http.get<IConfig>('/assets/config.json')
      .toPromise()
      .then(c => Object.assign(config, c));
  }
}

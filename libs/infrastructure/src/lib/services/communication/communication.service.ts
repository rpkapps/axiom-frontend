import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigCommand } from '@angular/cli/commands/config-impl';
import { ICommand, IConfig, IQuery } from './symbols';

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
    this._http.post<ICommand>(this.config.ApiUrl, command);
  }

  sendQuery(query: IQuery) {
    this._http.post<ICommand>(this.config.ApiUrl, query);
  }
}

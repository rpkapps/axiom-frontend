import { Inject, Injectable, InjectionToken } from '@angular/core';

export const STORAGE_PREFIX = new InjectionToken('STORAGE_KEY', { factory: () => '' });

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(STORAGE_PREFIX) private _prefix) {}

  localStorageSync(key: string, state: any) {
    return this._webStorageSync(localStorage, key, state);
  }

  sessionStorageSync(key: string, state: any) {
    return this._webStorageSync(sessionStorage, key, state);
  }

  private _webStorageSync(storage: Storage, key: string, state: any) {
    state = JSON.parse(storage.getItem(this._prefix + key)) || state || {};

    return new Proxy(state, {
      set: (target: Object, prop: string, value: any) => {
        target[prop] = value;
        storage.setItem(this._prefix + key, JSON.stringify(target));
        return true;
      }
    });
  }
}

import { Inject, Injectable, InjectionToken } from '@angular/core';

export const STORAGE_PREFIX = new InjectionToken('STORAGE_KEY', { factory: () => '' });

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(STORAGE_PREFIX) private _prefix) {}

  syncObject(key: string, initialState: Object) {
    initialState = JSON.parse(localStorage.getItem(this._prefix + key)) || initialState || {};

    return new Proxy(initialState, {
      set: (target: Object, prop: string, value: any) => {
        target[prop] = value;
        localStorage.setItem(this._prefix + key, JSON.stringify(target));
        return true;
      }
    });
  }
}

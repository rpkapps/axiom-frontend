import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { IUiWidget } from './symbols';

@Injectable()
export class UiWidgetService {
  private _widgets = new Map<string, IUiWidget>();

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,) {}

  register(widget: IUiWidget) {
    this._widgets.set(widget.Key, widget);
  }

  load(key: string) {
    if (this._widgets.has(key)) {
      return this._widgets
        .get(key).Load()
        .then(c => this._componentFactoryResolver.resolveComponentFactory(c));
    } else {
      return Promise.reject(`Widget "${ key }" not found.`);
    }
  }
}

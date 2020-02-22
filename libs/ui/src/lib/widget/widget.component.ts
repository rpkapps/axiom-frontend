import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef
} from '@angular/core';
import { UiWidgetService } from './widget.service';

@Component({
  selector: 'ui-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiWidgetComponent implements OnChanges {
  @Input('uiKey') key: string;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  error: string;

  constructor(
    private _widgetService: UiWidgetService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  render() {
    this.container.clear();
    this.error = '';

    this._widgetService.load(this.key)
      .then(c => {
        this.container.createComponent(c);
        this._cdr.markForCheck();
      })
      .catch(e => {
        this.error = e;
        this._cdr.markForCheck();
      })
  }
}

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd';
import { IColumnTags } from '../../symbols';

@Component({
  selector: 'lx-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsComponent implements OnChanges {
  @Input() columns: string[][];
  @Input() showColumns: number[];
  @Input() hideColumns: number[];

  @Input() @InputBoolean() taggable: boolean;
  @Input() tags: IColumnTags = {};
  @Output() tagsChange = new EventEmitter<IColumnTags>();

  @Input() @InputBoolean() selectable: boolean;
  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  selectedMap: boolean[] = [];
  hideColumnsMap: boolean[] = [];
  showColumnsMap: boolean[] = [];

  constructor(private _cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected) {
      this.selected = this.selected || [];

      this.selectedMap.length = 0;
      this.selected.forEach(columnIndex => this.selectedMap[columnIndex] = true);
    }

    if (changes.hideColumns) {
      this.hideColumns = this.hideColumns || [];

      this.hideColumnsMap.length = 0;
      this.hideColumns.forEach(columnIndex => this.hideColumnsMap[columnIndex] = true);
    }

    if (changes.showColumns) {
      this.showColumns = this.showColumns || [];

      this.showColumnsMap.length = 0;
      this.showColumns.forEach(columnIndex => this.showColumnsMap[columnIndex] = true);
    }
  }

  onColumnClick(columnIndex: number) {
    if (this.selectedMap[columnIndex]) {
      this.selected.splice(this.selected.indexOf(columnIndex), 1);
      this.selectedMap[columnIndex] = false;
    } else {
      this.selected.push(columnIndex);
      this.selectedMap[columnIndex] = true;
    }

    this.selectedChange.emit(this.selected);
  }

  onTagsChange(columnIndex: number, tags: string[]) {
    this.tags = this.tags || {};
    this.tags[columnIndex] = tags;
    this.tagsChange.emit(this.tags);
  }
}

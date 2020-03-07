import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { toggleItemInArray } from '@axiom/infrastructure';
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
  @Input() @InputBoolean() showToggleAll: boolean;
  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  allSelected: boolean;

  constructor(private _cdr: ChangeDetectorRef) { }

  get selectableColumnsLength() {
    return this.columns
      .filter((_, columnIndex) =>
        this.isColumnVisible(columnIndex)
      )
      .length;
  }

  ngOnChanges(changes: SimpleChanges) {}

  onToggleAllClick() {
    this.selected = !this.allSelected ? this.retrieveSelectableColumns() : [];
    this.allSelected = !this.allSelected;
    this.selectedChange.next(this.selected);
  }

  onColumnClick(columnIndex: number) {
    this.selected = this.selected || [];
    toggleItemInArray(this.selected, columnIndex);
    this.allSelected = this.selectableColumnsLength === this.selected.length;
    this.selectedChange.next(this.selected);
  }

  onTagsChange(columnIndex: number, tags: string[]) {
    this.tags = this.tags || {};
    this.tags[columnIndex] = tags;
    this.tagsChange.emit(this.tags);
  }

  isSelected(columnIndex: number) {
    return this.selected?.includes(columnIndex);
  }

  isColumnVisible(columnIndex: number) {
    return !this.hideColumns?.includes(columnIndex)
      && (!this.showColumns || this.showColumns.includes(columnIndex));
  }

  private retrieveSelectableColumns() {
    return this.columns
      .map((_, columnIndex) => columnIndex)
      .filter(columnIndex => this.isColumnVisible(columnIndex))
  }
}

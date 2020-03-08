import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { toggleItemInArray } from '@axiom/infrastructure';
import { InputBoolean } from 'ng-zorro-antd';
import { IColumnTags } from '../../symbols';

@Component({
  selector: 'lx-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsComponent {
  @Input() columns: string[][];
  @Input() showColumns: number[];
  @Input() hideColumns: number[];

  @Input() @InputBoolean() taggable: boolean;
  @Input() tags: IColumnTags = {};
  @Output() tagsChange = new EventEmitter<IColumnTags>();

  @Input() @InputBoolean() selectable: boolean;
  @Input() @InputBoolean() showToggleAll: boolean;
  @Input() selected: number[] = [];
  @Input() selectLimit: number;
  @Output() selectedChange = new EventEmitter<number[]>();

  allSelected: boolean;

  constructor(private _cdr: ChangeDetectorRef) { }

  onToggleAllClick() {
    this.selected = !this.allSelected ? this._retrieveSelectableColumns() : [];
    this.allSelected = !this.allSelected;
    this.selectedChange.next(this.selected);
  }

  onColumnClick(columnIndex: number) {
    this.selected = this.selected || [];
    const foundIndex = this.selected.indexOf(columnIndex);

    if (foundIndex !== -1) {
      this.selected.splice(foundIndex, 1);
      this.selectedChange.next(this.selected);
    } else if (this.selected.length !== this.selectLimit) {
      this.selected.push(columnIndex);
      this.selectedChange.next(this.selected);
    }

    this.allSelected = this._retrieveSelectableColumns().length === this.selected.length;
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

  private _retrieveSelectableColumns() {
    return this.columns
      .map((_, columnIndex) => columnIndex)
      .filter(columnIndex => this.isColumnVisible(columnIndex));
  }
}

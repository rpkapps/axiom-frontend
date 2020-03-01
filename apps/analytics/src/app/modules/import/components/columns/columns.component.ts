import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'lx-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsComponent implements OnChanges {
  @Input() columns: string[][];
  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  selectedMap: boolean[] = [];

  constructor(private _cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected) {
      this.selected = this.selected || [];
      this.selectedMap.length = 0;
      this.selected.forEach(columnIndex => this.selectedMap[columnIndex] = true);
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
    this._cdr.markForCheck();
  }
}

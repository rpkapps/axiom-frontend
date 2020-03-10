import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd';

@Component({
  selector: 'lx-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'column',
    '[class.is-selected]': 'selected',
    '[class.is-selectable]': 'selectable',
    '[tabIndex]': 'selectable ? 0 : -1',
  }
})
export class ColumnComponent {
  @Input() header: string;
  @Input() cells: string[];

  @Input() @InputBoolean() taggable: boolean;
  @Input() tags: string[];
  @Input() availableTags: string[];
  @Output() tagsChange = new EventEmitter<string[]>();
  @Output() tagAdd = new EventEmitter<string>();

  @Input() @InputBoolean() selectable: boolean;
  @Input() selected: boolean;

  @Input() click = new EventEmitter<MouseEvent>();

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('buttonElement', { static: false }) buttonElement: ElementRef<HTMLButtonElement>;

  inputVisible: boolean;
  newTag = '';

  constructor(private _cdr: ChangeDetectorRef) { }

  onAddTagClick() {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  onInputEnter() {
    this.tags = this.tags || [];

    if (this.newTag && !this.tags.includes(this.newTag)) {
      this.tags = [...(this.tags || []), this.newTag];
      this.tagsChange.emit(this.tags);
      this.tagAdd.emit(this.newTag);
      this.newTag = '';
    }
  }

  onInputBlur() {
    this.inputVisible = false;
    this.onInputEnter();
  }

  onTagRemove(tagIndex: number) {
    if (this.tags) {
      this.tags.splice(tagIndex, 1);
      this.tagsChange.emit(this.tags);
    }
  }
}

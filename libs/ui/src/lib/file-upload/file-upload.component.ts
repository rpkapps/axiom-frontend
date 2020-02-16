import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-file-upload'
  }
})
export class UiFileUploadComponent {
  @Input('uiFileName') fileName: string;
  @Input('uiProgress') progress: number;
  @Input('uiStatusText') statusText: string;
  @Input('uiStatus') status: 'uploading' | 'error' | 'done';

  @Output('uiFileChange') fileChange = new EventEmitter<File>();

  file: File;

  constructor() { }

  onFileChange(file: File) {
    this.file = file;
    this.fileChange.emit(file);
  }
}

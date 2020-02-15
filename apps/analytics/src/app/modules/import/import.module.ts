import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiFileUploadModule } from '@axiom/ui';
import { ImportComponent } from './import.component';


@NgModule({
  declarations: [ImportComponent],
  exports: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    UiFileUploadModule,
  ]
})
export class ImportModule {}

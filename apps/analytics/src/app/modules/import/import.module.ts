import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImportComponent } from './import.component';


@NgModule({
  declarations: [ImportComponent],
  exports: [
    ImportComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class ImportModule {}

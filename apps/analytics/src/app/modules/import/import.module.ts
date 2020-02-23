import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { ColumnsComponent } from './columns/columns.component';
import { FileComponent } from './file/file.component';
import { ImportComponent } from './import.component';
import { IndexComponent } from './index/index.component';
import { SettingsComponent } from './settings/settings.component';
import { TagsComponent } from './tags/tags.component';


@NgModule({
  declarations: [ImportComponent],
  exports: [ImportComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule.forChild([
      {
        path: '',
        component: ImportComponent,
        children: [
          { path: 'file', component: FileComponent },
          { path: 'settings', component: SettingsComponent },
          { path: 'index', component: IndexComponent },
          { path: 'columns', component: ColumnsComponent },
          { path: 'tags', component: TagsComponent },
        ]
      },
    ])
  ]
})
export class ImportModule {}

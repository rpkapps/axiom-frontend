import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NzButtonModule, NzFormModule, NzIconModule, NzInputModule, NzModalModule, NzSelectModule, NzStepsModule,
  NzTypographyModule
} from 'ng-zorro-antd';
import { StepsComponent } from './components/steps/steps.component';
import { ImportComponent } from './import.component';
import { ColumnsComponent } from './routes/columns/columns.component';
import { FileComponent } from './routes/file/file.component';
import { IndexComponent } from './routes/index/index.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { TagsComponent } from './routes/tags/tags.component';


@NgModule({
  declarations: [
    ImportComponent,
    FileComponent,
    SettingsComponent,
    IndexComponent,
    ColumnsComponent,
    TagsComponent,
    StepsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzTypographyModule,
    NzModalModule,
    NzStepsModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
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
          { path: '', redirectTo: 'file', pathMatch: 'full' }
        ]
      }
    ])
  ]
})
export class ImportModule {}

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
import { SelectColumnsComponent } from './routes/select-columns/select-columns.component';
import { SelectFileComponent } from './routes/select-file/select-file.component';
import { SelectIndexComponent } from './routes/select-index/select-index.component';
import { SelectTagsComponent } from './routes/select-tags/select-tags.component';
import { SettingsComponent } from './routes/settings/settings.component';


@NgModule({
  declarations: [
    ImportComponent,
    SelectFileComponent,
    SettingsComponent,
    SelectIndexComponent,
    SelectColumnsComponent,
    SelectTagsComponent,
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
          { path: 'file', component: SelectFileComponent },
          { path: 'settings', component: SettingsComponent },
          { path: 'index', component: SelectIndexComponent },
          { path: 'columns', component: SelectColumnsComponent },
          { path: 'tags', component: SelectTagsComponent },
          { path: '', redirectTo: 'file', pathMatch: 'full' }
        ]
      }
    ])
  ]
})
export class ImportModule {}

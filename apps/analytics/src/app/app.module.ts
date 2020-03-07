import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { InitializerService, STORAGE_PREFIX } from '@axiom/infrastructure';
import { en_US, NZ_I18N, NzButtonModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { ImportModule } from './modules/import/import.module';
import { WorkspaceComponent } from './workspace/workspace.component';

export function appInitializerFactory(initializer: InitializerService) {
  return () => initializer.initialize();
}

@NgModule({
  declarations: [AppComponent, WorkspaceComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ImportModule,
    NzButtonModule,
    RouterModule.forRoot([
      {
        path: ':workspaceId',
        component: WorkspaceComponent,
        children: [
          { path: 'import', loadChildren: () => import('./modules/import/import.module').then(m => m.ImportModule) }
        ]
      }
    ], { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: STORAGE_PREFIX, useValue: 'lx_' },
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [InitializerService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

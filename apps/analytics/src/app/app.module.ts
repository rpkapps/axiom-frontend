import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '@axiom/infrastructure';
import { AppComponent } from './app.component';
import { ImportModule } from './modules/import/import.module';
import { WorkspaceComponent } from './workspace/workspace.component';

export function initializeApp(com: CommunicationService) {
  return () => com.init();
}

@NgModule({
  declarations: [AppComponent, WorkspaceComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    ImportModule,
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
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [CommunicationService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

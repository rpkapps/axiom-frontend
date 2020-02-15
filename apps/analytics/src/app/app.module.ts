import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommunicationService } from '@axiom/infrastructure';
import { HttpClientModule } from '@angular/common/http';
import { ImportModule } from './modules/import/import.module';

export function initializeApp(com: CommunicationService) {
  return () => com.loadConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    ImportModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [CommunicationService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

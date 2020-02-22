import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '@axiom/infrastructure';
import { AppComponent } from './app.component';
import { ImportModule } from './modules/import/import.module';

export function initializeApp(com: CommunicationService) {
  return () => com.init();
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

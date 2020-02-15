import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationService, Store } from '@axiom/infrastructure';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IImportState, IImportViewModel } from './symbols';

@Injectable()
export class ImportService implements OnDestroy {
  state = new Store<IImportState>({
    UploadResponse: null
  });

  importViewModel$: Observable<IImportViewModel>;

  private _uploadSubscription: Subscription;

  constructor(private _com: CommunicationService) {
    this.importViewModel$ = combineLatest([
      this.state.select('UploadResponse')
    ]).pipe(
      map(x => <IImportViewModel> {
        UploadResponse: x[0]
      })
    );
  }

  upload(file: File) {
    this.unsubscribeFromUpload();

    this._uploadSubscription = this._com.upload(file)
      .subscribe(response => {
        this.state.setState({ UploadResponse: response });
      })
  }

  ngOnDestroy() {
    this.unsubscribeFromUpload();
  }

  private unsubscribeFromUpload() {
    if (this._uploadSubscription) {
      this._uploadSubscription.unsubscribe();
    }
  }
}

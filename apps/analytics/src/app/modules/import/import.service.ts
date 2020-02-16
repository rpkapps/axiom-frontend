import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationService, IUploadResponse } from '@axiom/infrastructure';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class ImportService implements OnDestroy {
  uploadFileResponse$ = new BehaviorSubject<IUploadResponse>({} as IUploadResponse);

  private _uploadSubscription: Subscription;

  constructor(private _com: CommunicationService) { }

  upload(file: File) {
    this._uploadSubscription = this._com.upload(file)
      .subscribe(response => {
        this.uploadFileResponse$.next(response);
      });
  }

  ngOnDestroy() {
    if (this._uploadSubscription) {
      this._uploadSubscription.unsubscribe();
    }
  }
}

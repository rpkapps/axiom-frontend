import { Injectable } from '@angular/core';
import { CommunicationService, IUploadResponse } from '@axiom/infrastructure';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  uploadResponses$ = new BehaviorSubject<BehaviorSubject<IUploadResponse>[]>([]);

  constructor(private _com: CommunicationService) { }

  upload(file: File) {
    const uploadResponse$ = new BehaviorSubject({} as IUploadResponse);

    this.uploadResponses$.next([
      ...this.uploadResponses$.getValue(),
      uploadResponse$
    ]);

    this._com.upload(file).subscribe(response => uploadResponse$.next(response));
  }
}

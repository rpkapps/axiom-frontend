import { Injectable } from '@angular/core';
import { CommunicationService, IUploadResponse } from '@axiom/infrastructure';
import { BehaviorSubject } from 'rxjs';
import { IFile } from './modules/import/symbols';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  workspaceId: string;

  uploadResponses$ = new BehaviorSubject<IUploadResponse[]>([]);

  constructor(private _com: CommunicationService) { }

  upload(file: File) {
    this._com.upload(this.workspaceId, file).subscribe(response => {
      const responses = this.uploadResponses$.getValue();

      if (!responses.find(r => r.FileName === response.FileName)) {
        responses.push(response);
      }

      this.uploadResponses$.next([...responses]);
    });
  }
}

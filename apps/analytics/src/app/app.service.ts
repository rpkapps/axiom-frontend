import { Injectable } from '@angular/core';
import { ApiService, IFile, IStatus, NotificationService } from '@axiom/infrastructure';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  workspaceId: string;

  uploads$ = new BehaviorSubject<IFile[]>([]);
  imports$ = new BehaviorSubject<IStatus[]>([]);

  constructor(
    private _apiService: ApiService,
    private _notificationService: NotificationService
  ) {
    this._subscribeToImports();
  }

  upload(file: File) {
    this._apiService
      .upload(this.workspaceId, file)
      .subscribe(upload => {
        const uploads = this.uploads$.getValue();

        if (!uploads.find(r => r.FileName === upload.FileName)) {
          uploads.push(upload);
        }

        this.uploads$.next([...uploads]);
      });
  }

  private _subscribeToImports() {
    this._notificationService.$
      .pipe(
        filter(s =>
          s.Key === 'Status'
          && s.Command.Key === 'ImportFile'
        )
      )
      .subscribe((status: IStatus) => {
        const imports: IStatus[] = this.imports$.getValue();
        const index = imports.findIndex(x => x.Command.TransactionId === status.Command.TransactionId);

        if (index !== -1) {
          imports[index] = status;
        } else {
          imports.push(status);
        }

        this.imports$.next([...imports]);
      });
  }
}

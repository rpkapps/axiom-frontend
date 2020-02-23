export interface IConfig {
  ApiUrl: string;
  SignalRUrl: string;
}

export interface INotification {
  Key: string;

  [key: string]: any;
}

export interface IStatus extends INotification {
  LastModified: string;
  State: 'InProgress' | 'Completed' | 'Failed';
  Status: any;
  Progress: number;
  ResultQuery: any;
  Command: ICommand;
}

export interface ICommand {
  Key: string;
  TransactionId?: string;

  [key: string]: any;
}

export interface IQuery {
  Key: string;

  [key: string]: any;
}

export interface IUploadResponse {
  FileId: string;
  FileName: string;
  Size: number;
  Type: string;
  Progress: number;
  BytesLoaded: number;
  Status: 'Uploading' | 'Done' | 'Error';
  StatusText: string;
}

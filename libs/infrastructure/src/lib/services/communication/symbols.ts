export interface IConfig {
  ApiUrl: string;
  SignalRUrl: string;
}

export interface INotification {
  Key: string;

  [key: string]: any;
}

export interface IStatus extends INotification, ICommand {
  LastModified: string;
  State: 'InProgress' | 'Completed' | 'Failed';
  Status: any;
  Progress: number;
  CommandKey: string;
  ResultQuery: any;
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
  Name: string;
  Size: number;
  Type: string;
  Progress: number;
  BytesLoaded: number;
  Status: 'uploading' | 'done' | 'error';
  StatusText: string;
}

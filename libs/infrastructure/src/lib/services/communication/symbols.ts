export interface IConfig {
  ApiUrl: string;
  SignalRUrl: string;
}

export interface ICommand {
  Key: string;
  TransactionId: string;

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

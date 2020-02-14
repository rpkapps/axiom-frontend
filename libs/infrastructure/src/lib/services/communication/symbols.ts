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

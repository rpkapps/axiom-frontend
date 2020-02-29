export interface ICommand {
  Key: string;
  TransactionId?: string;

  [key: string]: any;
}

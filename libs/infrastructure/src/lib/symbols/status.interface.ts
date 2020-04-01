import { ICommand } from './command.interface';
import { INotification } from './notification.interface';

export interface IStatus extends INotification {
  LastModified: string;
  State: 'InProgress' | 'Complete' | 'Failed';
  Status: any;
  Progress: number;
  ResultQuery: any;
  Command: ICommand;
}

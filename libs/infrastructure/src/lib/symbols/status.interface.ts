import { ICommand } from './command.interface';
import { INotification } from './notification.interface';

export interface IStatus extends INotification {
  LastModified: string;
  State: 'InProgress' | 'Completed' | 'Failed';
  Status: any;
  Progress: number;
  ResultQuery: any;
  Command: ICommand;
}

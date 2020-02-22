import { Type } from '@angular/core';

export interface IUiWidget {
  Key: string;
  Load: () => Promise<Type<any>>;
}

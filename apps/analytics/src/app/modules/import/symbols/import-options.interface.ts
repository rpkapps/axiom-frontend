export interface IImportOptions {
  FileId?: string;
  IndexColumns?: number[];
  DataColumns?: number[];
  DataTypeId?: string;
  TimeTypeId?: string;
  EmptyValue?: string;
  FixIds?: string[];
  IgnoredRows?: number[];
  IgnoredColumns?: number[];
  Overrides?: ICellValue[];
  ColumnTags?: IColumnTags;
}

export interface  ICellValue {
  Row: number;
  Column: number;
  Value: string;
}

export interface IColumnTags {
  [Column: number]: string[]
}

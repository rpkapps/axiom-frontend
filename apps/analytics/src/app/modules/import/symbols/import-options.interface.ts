export interface IAnalyzeOptions {
  FileId?: string;
  IndexColumns?: number[];
  DataColumns?: number[];
  DataTypeId?: string;
  TimeTypeId?: string;
  EmptyValue?: string;
}

export interface IImportOptions {
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

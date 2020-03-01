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
  ColumnTags?: { [Column: number]: string[] };
}

export interface  ICellValue {
  Row: number;
  Column: number;
  Value: string;
}

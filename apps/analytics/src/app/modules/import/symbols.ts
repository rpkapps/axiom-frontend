export interface IFilePreview {
  Error?: string;
  Preview?: string[][];
}

export interface IImportOptions {
  FileId?: string;
  IndexColumn?: number;
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

export interface ICellValue {
  Row: number;
  Column: number;
  Value: string;
}

export interface IAnalyzeResponse {
  Error?: string;
  Analysis?: IAnalysisError[];
  Progress?: number;
}

export interface IAnalysisError {
  Error: IErrorType;
  Count: number;
  Fixes: IFixType[];
  Column: number;
  ColumnNames: string[];
  Examples: IErrorExample[];
}

export interface IErrorType {
  ErrorId: string;
  ErrorName: string;
}

export interface IFixType {
  FixId: string;
  FixName: string;
}

export interface IDataType {
  DataTypeId: string;
  DataTypeName: string;
}

export interface ITimeType {
  TimeTypeId: string;
  TimeTypeName: string;
}

export interface IErrorExample {
  Row: number;
  Data: string[][];
}

export interface ITagGroup {
  TagGroupId: string;
  TagGroupName: string;
  Tags: string[];
}

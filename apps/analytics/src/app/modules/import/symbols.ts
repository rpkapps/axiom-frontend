export interface IFile {
  FileId: string;
  FileName: string;
  WorkspaceId: string;
}

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
  Examples: string[][][];
}

export interface IErrorType {
  ErrorId: string;
  ErrorName: string;
}

export interface IFixType {
  FixId: string;
  FixName: string;
}

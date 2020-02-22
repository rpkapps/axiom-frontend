export interface IFile {
  FileId: string;
  FileName: string;
}

export interface IFilePreview {
  Error?: string;
  Preview?: string[][];
}

export interface IImportOptions {
  FileId: string;
  IndexColumn: number;
  DataColumns: number[];
  Transposed: boolean;
  DataTypeId: string;
}

export interface IAnalyzeResponse {
  Error?: string;
  Analysis?: IAnalysisError[];
  Progress?: number;
}

export interface IAnalysisError {
  ErrorId: string;
  Count: number;
  FixIds: string[];
  Column: number;
  Examples: string[][][];
}

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

export interface IErrorExample {
  Row: number;
  Data: string[][];
}

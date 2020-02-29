export interface IFile {
  FileId: string;
  FileName: string;
  WorkspaceId: string;
  Progress: number;
  Status: 'Uploading' | 'Done' | 'Error';
}

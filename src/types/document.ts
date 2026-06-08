export interface ImageSrc extends Record<FileType, string | null> {
  document: string | null;
  idPicture: string | null;
}

export type FileType = 'document' | 'idPicture';

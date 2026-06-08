import type { UploadVisible } from '@/enums/uploads.ts';

export interface FileWithMetadataBody {
  file: File;
  attachmentTitle: string;
  typeUpload?: number;
  isVisible?: UploadVisible;
}

export interface FileWithMetadata extends FileWithMetadataBody {
  id: string;
}
export interface FileWithMetadataWithoutFile extends Omit<FileWithMetadata, 'file'> {
  file?: File;
}

import type { FileWithMetadata } from '@/types/uploads.ts';

export interface FileWithMetadataNew extends FileWithMetadata {
  isNew?: boolean;
}

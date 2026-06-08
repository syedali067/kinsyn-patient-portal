interface FocalPoint {
  x: number;
  y: number;
}

interface OptimizedImageUrls {
  [key: string]: string;
}

interface OptimizedImage {
  optimizedImageUrls: OptimizedImageUrls;
  optimizedWebPImageUrls: OptimizedImageUrls;
  variantSourceWidths: string[];
  variantHeights: { [key: string]: unknown };
}

export interface Attachment {
  isFolder: boolean;
  sourcePath: string | null;
  folderId: number;
  uploaderId: string | null;
  folderPath: string | null;
  kind: string;
  alt: string | null;
  size: number;
  keptFile: string | null;
  dateModified: string;
  newLocation: string | null;
  locationError: string | null;
  newFilename: string | null;
  newFolderId: string | null;
  tempFilePath: string | null;
  avoidFilenameConflicts: boolean;
  suggestedFilename: string | null;
  conflictingFilename: string | null;
  deletedWithVolume: boolean;
  keepFileOnDelete: boolean;
  eagerLoadInfo: string | null;
  id: number;
  tempId: string | null;
  draftId: string | null;
  revisionId: string | null;
  isProvisionalDraft: boolean;
  uid: string;
  siteSettingsId: number;
  fieldLayoutId: number;
  enabled: boolean;
  archived: boolean;
  siteId: number;
  title: string;
  slug: string | null;
  uri: string | null;
  dateCreated: string;
  dateUpdated: string;
  dateLastMerged: string | null;
  dateDeleted: string | null;
  deletedWithOwner: string | null;
  trashed: boolean;
  isNewForSite: boolean;
  forceSave: boolean;
  canonicalId: number;
  cpEditUrl: string;
  isDraft: boolean;
  isRevision: boolean;
  isUnpublishedDraft: boolean;
  ref: string | null;
  status: string;
  structureId: string | null;
  url: string;
  extension: string;
  filename: string;
  focalPoint: FocalPoint;
  hasFocalPoint: boolean;
  height: number;
  mimeType: string;
  path: string;
  volumeId: number;
  width: number;
  optimizedImage: OptimizedImage;
}

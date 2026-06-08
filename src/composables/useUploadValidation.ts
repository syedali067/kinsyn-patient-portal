import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';

export const useUploadValidation = () => {
  const toastStore = useToastStore();
  const { t } = useI18n();

  const maxFileSize = 16; //MB

  const allowedTypesUploads = {
    values: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/tiff',
    ],
    types: ['jpg', 'png', 'pdf', 'doc', 'docx', 'tiff'],
  };

  const allowedTypesProgress = {
    values: ['image/jpeg', 'image/jpg', 'image/png'],
    types: ['jpg', 'png'],
  };

  const allowedTypesChat = {
    values: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/x-adobe-dng',
      'image/tiff',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    types: ['jpg', 'png', 'dng', 'tiff', 'pdf', 'doc', 'docx'],
  };

  const allowedTypesAvatar = {
    values: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    types: ['jpg', 'jpeg', 'png', 'gif'],
  };

  const allowedTypesIdentification = {
    values: ['image/jpeg', 'image/jpg', 'image/png'],
    types: ['jpg', 'png'],
  };

  const formatTypesWithAnd = (typesArray: string[]) => {
    if (typesArray.length === 0) return '';
    if (typesArray.length === 1) return typesArray[0];
    if (typesArray.length === 2) return `${typesArray[0]} and ${typesArray[1]}`;

    return `${typesArray.slice(0, -1).join(', ')} and ${typesArray[typesArray.length - 1]}`;
  };

  const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
    const fileType = file.type;
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();

    return allowedTypes.some((type) => {
      return fileType === type || extension === type.split('/').pop();
    });
  };

  const fileSizeCheck = (files: File | File[] | FileList, message?: string) => {
    const fileList =
      files instanceof FileList ? Array.from(files) : Array.isArray(files) ? files : [files];

    const isFileTooLarge = fileList.some((file) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        toastStore.addToast({
          type: 'error',
          text: message ?? t('maximumFileSize', { size: maxFileSize }),
        });
        return true;
      }
      return false;
    });

    return !isFileTooLarge;
  };

  return {
    allowedTypesUploads,
    allowedTypesProgress,
    allowedTypesChat,
    formatTypesWithAnd,
    allowedTypesAvatar,
    allowedTypesIdentification,
    isValidFileType,
    fileSizeCheck,
    maxFileSize,
  };
};

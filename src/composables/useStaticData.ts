import IconDoc from '@/assets/icons/doc.svg?component';
import IconFemale from '@/assets/icons/female.svg?component';
import IconFile from '@/assets/icons/file.svg?component';
import IconImage from '@/assets/icons/image.svg?component';
import IconMonitor from '@/assets/icons/monitor.svg?component';
import IconPdf from '@/assets/icons/pdf.svg?component';
import IconScale from '@/assets/icons/scale.svg?component';
import type { CardType } from '@/types/payment';
import type { Category } from '@/types/treatment';
import type { ProfileUser } from '@/types/user';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useStaticData = () => {
  const { t } = useI18n();

  const categories = computed<Category[]>(() => [
    {
      id: 'longevity',
      label: t('longevity'),
      icon: IconMonitor,
    },
    {
      id: 'weight-management',
      label: t('weightManagement'),
      icon: IconScale,
    },
    {
      id: 'labs',
      label: t('labs'),
      icon: IconMonitor,
    },
    {
      id: 'womens-health',
      label: t('womensHealth'),
      icon: IconFemale,
    },
  ]);

  const genderOptions = computed(
    () =>
      [
        { value: 'M', label: t('male') },
        { value: 'F', label: t('female') },
      ] satisfies { value: ProfileUser['gender']; label: string }[],
  );

  const fileTypes = computed(() => [
    {
      id: 'doc',
      types: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'word',
      ],
      icon: IconDoc,
    },
    {
      id: 'pdf',
      types: ['application/pdf', 'pdf'],
      icon: IconPdf,
    },
    {
      id: 'img',
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/x-adobe-dng', 'image'],
      icon: IconImage,
    },
    {
      id: 'unknown',
      types: [],
      icon: IconFile,
    },
  ]);

  const paymentMap: Record<CardType, { label: string }> = {
    visa: {
      label: 'Visa',
    },
    mastercard: {
      label: 'Mastercard',
    },
    american_express: {
      label: 'American Express',
    },
    discover: {
      label: 'Discover',
    },
    jcb: {
      label: 'JCB',
    },
    maestro: {
      label: 'Maestro',
    },
  };

  const months = [
    {
      label: t('january'),
      value: '01',
    },
    {
      label: t('february'),
      value: '02',
    },
    {
      label: t('march'),
      value: '03',
    },
    {
      label: t('april'),
      value: '04',
    },
    {
      label: t('may'),
      value: '05',
    },
    {
      label: t('june'),
      value: '06',
    },
    {
      label: t('july'),
      value: '07',
    },
    {
      label: t('august'),
      value: '08',
    },
    {
      label: t('september'),
      value: '09',
    },
    {
      label: t('october'),
      value: '10',
    },
    {
      label: t('november'),
      value: '11',
    },
    {
      label: t('december'),
      value: '12',
    },
  ];

  return {
    categories,
    genderOptions,
    fileTypes,
    paymentMap,
    months,
  };
};

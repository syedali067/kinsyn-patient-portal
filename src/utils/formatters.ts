import { t } from '@/locales/i18n';
import type { Address } from '@/types/user.ts';
import type { Variant, VariantPeriodUnit } from '@/types/variant';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const toTimeZone = (date: Date, formatStr: string, timeZone: string | undefined) => {
  if (!timeZone) return format(date, formatStr);

  timeZone = timeZone.replace('−', '-');

  const match = timeZone.match(/^UTC([+-])(\d{1,2})$/);

  if (match) {
    const sign = match[1] === '+' ? '-' : '+';
    const offset = match[2];
    timeZone = `Etc/GMT${sign}${offset}`;
  }

  return formatInTimeZone(date, timeZone, formatStr);
};

export const stringToSecondaryReadableDateFormat = (
  dateString: string,
  includeTime: boolean = false,
) => {
  const date: Date = new Date(dateString);
  const formatString = includeTime ? 'PPP p' : 'PPP';

  return format(date, formatString);
};

/**
 * Format date to short date format
 * @param dateString - Date string or Date object
 * @param onlyDay - Only show day (e.g. 18)
 * @returns Short date format (e.g. Aug 18)
 */
export const toShortDate = (
  dateString: string | Date,
  { onlyDay = false }: { onlyDay?: boolean } = {},
) => {
  const date: Date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  return format(date, onlyDay ? 'd' : 'MMM d');
};

export const formatSecondsToReadableTime = (
  seconds: number | null,
  trimNullable: boolean = false,
): string | undefined => {
  if (!seconds) return undefined;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const hoursStr = trimNullable && !hours ? '' : `${hours}${t('hr')}`;
  const minutesStr = trimNullable && !minutes ? '' : `${minutes}${t('min')}`;

  if (trimNullable && !hoursStr && !minutesStr) return undefined;

  return `${hoursStr} ${minutesStr}`.trim();
};

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
export const formatFileSize = (bytes: number, decimals = 1) => {
  let u = 0;

  while (bytes >= 1024 && u < units.length - 1) {
    bytes /= 1024;
    u += 1;
  }

  return `${bytes.toFixed(decimals)}${units[u]}`;
};

export const formatPrice = (amount = 0, currency = 'usd') => {
  const price = amount / 100;
  const isInteger = Number.isInteger(price);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  });

  return formatter.format(price);
};

export const formatPhoneNumber = (phoneNumber?: string | null) => {
  if (!phoneNumber) return;
  return phoneNumber.replace(/^\+?(\d{1,3})?\s*(\d{3})\s*(\d{3})\s*(\d{4}).*$/, '($2) $3-$4');
};

export const formatUnitPeriod = (period = 1, unit?: VariantPeriodUnit) => {
  return unit ? `${period} ${t(unit, period).toLowerCase()}` : `${period}`;
};

export const formatAddress = (addressData?: Address | null) => {
  const fullName = [addressData?.addressFirstName, addressData?.addressLastName]
    .filter(Boolean)
    .join(' ');

  const addressArray = [fullName, addressData?.addressLine1, addressData?.addressLine2];

  const apt = addressData?.addressLine3;

  const locality = addressData?.locality;
  const administrativeArea = addressData?.administrativeArea;
  const postalCode = addressData?.postalCode;

  const locationPart = [locality, administrativeArea, postalCode]
    .filter((line) => line && line.trim() !== '')
    .join(', ');

  const country = addressData?.countryCode;
  const phoneNumber = formatPhoneNumber(addressData?.phone);

  const finalArray = [...addressArray, apt, locationPart, country, phoneNumber];

  return finalArray.filter((line) => line && line.trim() !== '');
};

export const startingAtFromVariants = (
  arr: Variant[] | undefined,
): { startingAt?: string; amount?: string } => {
  if (!arr || !arr.length) return {};

  const itemsWithPeriod = arr.filter((item) => item.variantPeriod);

  if (itemsWithPeriod.length > 0) {
    const minPeriodItem = itemsWithPeriod.reduce((min, current) =>
      current.variantAmount / current.variantPeriod < min.variantAmount / min.variantPeriod
        ? current
        : min,
    );

    return {
      startingAt: `${formatPrice(minPeriodItem.variantAmount / minPeriodItem.variantPeriod)}/${minPeriodItem.variantPeriodUnit.charAt(0)}`,
    };
  }

  const minAmountItem = arr.reduce((min, current) =>
    current.variantAmount < min.variantAmount ? current : min,
  );

  return {
    amount: formatPrice(minAmountItem.variantAmount),
  };
};

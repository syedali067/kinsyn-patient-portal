import { type Config } from 'dompurify';

export const messageOptions: Config = {
  ALLOWED_TAGS: ['p', 'b', 'i', 'u', 'strong', 'em', 'br', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

export const productDescriptionOptions: Config = {
  ALLOWED_TAGS: ['p'],
};

export const clearAllHTMLOptions: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

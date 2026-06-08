import type { MaskInputOptions } from 'maska';
import { reactive } from 'vue';

export const maskPhone = reactive<MaskInputOptions>({
  mask: '(999) 999-9999',
  tokens: {
    '9': { pattern: /[0-9]/ },
  },
});

export const maskPostalCode = reactive<MaskInputOptions>({
  mask: ['99999', '99999-9999'],
  tokens: {
    '9': { pattern: /[0-9]/ },
  },
});

export const maskDay = reactive<MaskInputOptions>({
  mask: 'DD',
  tokens: {
    D: { pattern: /[0-9]/ },
  },
});

export const maskYear = reactive<MaskInputOptions>({
  mask: 'YYYY',
  tokens: {
    Y: { pattern: /[0-9]/ },
  },
});

export const maskWeight = reactive<MaskInputOptions>({
  mask: 'ABC.BB',
  tokens: {
    A: { pattern: /[1-9]/ },
    B: { pattern: /[0-9]/ },
    C: { pattern: /[0-9]/, optional: true },
  },
});

export const maskDoubleName = {
  preProcess: (val: string) => {
    const words = val
      .replace(/[^a-zA-Z'\- ]/g, '')
      .replace(/  +/g, ' ')
      .split(' ')
      // Max 2 words
      .slice(0, 2)
      // Capitalize first letter AND letters after hyphen/apostrophe/space
      // Preserves internal caps in names like McDonald, O'Connor, Smith-Jones
      .map((word) =>
        word.replace(/\b\w/g, (char, index) =>
          index === 0 || word[index - 1]?.match(/[-'\s]/) ? char.toUpperCase() : char.toLowerCase(),
        ),
      );
    return words.join(' ');
  },
};

export const maskAddress = {
  preProcess: (val: string) => val.replace(/  +/g, ' '),
};

export const maskEmail = {
  preProcess: (val: string) => val.replace(/\s/g, '').toLowerCase(),
};

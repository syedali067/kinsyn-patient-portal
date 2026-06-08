export type BaseSelectOption = {
  [key: string]: string | number | boolean | undefined;
  label?: string;
  value?: string | number;
  icon?: string;
  iconStyles?: string;
  buttonLabel?: string;
  optionGroup?: boolean;
};

export type BaseSelectSize = '48';

export interface BaseTab {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export type BaseTabTheme = 'tab' | 'underline' | 'text' | 'underline-text';

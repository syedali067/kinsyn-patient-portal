import BaseButton from './BaseButton.vue';
import IconCheck from '@/assets/icons/check.svg?component';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    default: { control: 'text' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    to: { control: 'text' },
    href: { control: 'text' },
    target: { control: 'select', options: ['_self', '_blank', '_parent', '_top'] },
    disabled: { control: 'boolean' },
    theme: { control: 'select', options: ['solid', 'outline', 'link'] },
    color: { control: 'select', options: ['dark', 'light', 'gray', 'contrast', 'brand'] },
    size: { control: 'select', options: ['32', '37', '40', '44', '48', '64'] },
    rounded: { control: 'boolean' },
    span: { control: 'boolean' },
    loading: { control: 'boolean' },
    group: { control: 'boolean' },
  },
  args: {
    default: 'Button',
    type: 'button',
    to: '',
    href: '',
    target: '_self',
    disabled: false,
    theme: 'solid',
    color: 'dark',
    size: '44',
    rounded: false,
    span: false,
    loading: false,
    group: false,
  },
} satisfies Meta<typeof BaseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolidDark: Story = {
  args: {
    theme: 'solid',
    color: 'dark',
  },
};

export const SolidLight: Story = {
  args: {
    theme: 'solid',
    color: 'light',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const SolidGray: Story = {
  args: {
    theme: 'solid',
    color: 'gray',
  },
};

export const OutlineDark: Story = {
  args: {
    theme: 'outline',
    color: 'dark',
  },
};

export const OutlineLight: Story = {
  args: {
    theme: 'outline',
    color: 'light',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const OutlineContrast: Story = {
  args: {
    theme: 'outline',
    color: 'contrast',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const LinkDark: Story = {
  args: {
    theme: 'link',
    color: 'dark',
  },
};

export const LinkBrand: Story = {
  args: {
    theme: 'link',
    color: 'brand',
  },
};

export const PrependSlot: Story = {
  args: {
    prepend: '<IconCheck class="size-20" />',
  },
  render: (args) => ({
    components: { BaseButton, IconCheck },
    setup() {
      return { args };
    },
    template: `
      <BaseButton v-bind="args">
        <template #prepend>
          ${args.prepend}
        </template>
        ${args.default}
      </BaseButton>
    `,
  }),
};

export const AppendSlot: Story = {
  args: {
    append: '<IconCheck class="size-20" />',
  },
  render: (args) => ({
    components: { BaseButton, IconCheck },
    setup() {
      return { args };
    },
    template: `
      <BaseButton v-bind="args">
        <template #append>
          ${args.append}
        </template>
        ${args.default}
      </BaseButton>
    `,
  }),
};

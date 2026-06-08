import BaseInput from './BaseInput.vue';
import IconCheck from '@/assets/icons/check.svg?component';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'tel', 'url', 'password', 'number'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    size: { control: 'select', options: ['48'] },
    animatedPlaceholder: { control: 'boolean' },
  },
  args: {
    placeholder: 'Placeholder',
    type: 'text',
    disabled: false,
    error: '',
    size: '48',
    animatedPlaceholder: true,
  },
} satisfies Meta<typeof BaseInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrependSlot: Story = {
  args: {
    prepend: '<IconCheck class="size-20" />',
  },
  render: (args) => ({
    components: { BaseInput, IconCheck },
    setup() {
      return { args };
    },
    template: `
      <BaseInput v-bind="args">
        <template #prepend>
          ${args.prepend}
        </template>
      </BaseInput>
    `,
  }),
};

export const AppendSlot: Story = {
  args: {
    append: '<IconCheck class="size-20" />',
  },
  render: (args) => ({
    components: { BaseInput, IconCheck },
    setup() {
      return { args };
    },
    template: `
      <BaseInput v-bind="args">
        <template #append>
          ${args.append}
        </template>
      </BaseInput>
    `,
  }),
};

import BaseOtpInput from './BaseOtpInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Base/BaseOtpInput',
  component: BaseOtpInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['48'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    name: { control: 'text' },
    length: { control: 'number' },
  },
  args: {
    placeholder: '○',
    size: '48',
    disabled: false,
    error: '',
    name: '',
    length: 5,
  },
} satisfies Meta<typeof BaseOtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseOtpInput },
    setup() {
      const code = ref('');
      return { args, code };
    },
    template: `
      <div class="w-fit">
        <BaseOtpInput v-bind="args" v-model="code" />
        <div class="mt-12 text-14 text-stone">Value: {{ code }}</div>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  args: {
    error: 'Invalid code',
  },
  render: (args) => ({
    components: { BaseOtpInput },
    setup() {
      const code = ref('');
      return { args, code };
    },
    template: `<BaseOtpInput v-bind="args" v-model="code" />`,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { BaseOtpInput },
    setup() {
      const code = ref('');
      return { args, code };
    },
    template: `<BaseOtpInput v-bind="args" v-model="code" />`,
  }),
};

export const CustomLength: Story = {
  args: {
    length: 6,
  },
  render: (args) => ({
    components: { BaseOtpInput },
    setup() {
      const code = ref('');
      return { args, code };
    },
    template: `
      <div class="w-fit">
        <BaseOtpInput v-bind="args" v-model="code" />
        <div class="mt-12 text-14 text-stone">Value: {{ code }}</div>
      </div>
    `,
  }),
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: '•',
  },
  render: (args) => ({
    components: { BaseOtpInput },
    setup() {
      const code = ref('');
      return { args, code };
    },
    template: `
      <div class="w-fit">
        <BaseOtpInput v-bind="args" v-model="code" />
        <div class="mt-12 text-14 text-stone">Value: {{ code }}</div>
      </div>
    `,
  }),
};

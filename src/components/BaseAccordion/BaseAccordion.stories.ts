import BaseAccordion from './BaseAccordion.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ConcreteComponent } from 'vue';

const meta = {
  title: 'Base/BaseAccordion',
  component: BaseAccordion as unknown as ConcreteComponent,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'number' },
    collapsible: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    theme: {
      control: 'select',
      options: ['clear', 'filled'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    defaultValue: { control: 'text' },
  },
  args: {
    length: 2,
    collapsible: true,
    type: 'single',
    theme: 'clear',
    orientation: 'horizontal',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseAccordion },
    setup() {
      return { args };
    },
    template: `
      <BaseAccordion v-bind="args">
        <template #title-0>
          Accordion title 1
        </template>
        <template #content-0>
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </template>

        <template #title-1>
          Accordion title 2
        </template>
        <template #content-1>
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </template>
      </BaseAccordion>
    `,
  }),
};

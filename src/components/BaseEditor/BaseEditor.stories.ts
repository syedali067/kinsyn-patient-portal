import BaseEditor from './BaseEditor.vue';
import IconClip from '@/assets/icons/clip.svg?component';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseEditor',
  component: BaseEditor,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    fieldClass: { control: 'text' },
  },
  args: {
    placeholder: 'Placeholder',
    disabled: false,
    fieldClass: 'min-h-64 max-h-122',
  },
} satisfies Meta<typeof BaseEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AppendSlot: Story = {
  args: {
    append: '<IconClip />',
  },
  render: (args) => ({
    components: { BaseEditor, IconClip },
    setup() {
      return { args };
    },
    template: `
      <BaseEditor v-bind="args">
        <template #append>
          ${args.append}
        </template>
      </BaseEditor>
    `,
  }),
};

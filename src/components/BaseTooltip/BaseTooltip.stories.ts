import BaseButton from '../BaseButton/BaseButton.vue';
import BaseTooltip from './BaseTooltip.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BaseTooltip',
  component: BaseTooltip,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    side: { control: 'select', options: ['right', 'top', 'bottom', 'left'] },
    sideOffset: { control: 'number' },
    collisionPadding: { control: 'number' },
    contentClass: { control: 'text' },
  },
  args: {
    align: 'start',
    side: 'right',
    sideOffset: 8,
    collisionPadding: 16,
    contentClass: '',
  },
} satisfies Meta<typeof BaseTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BaseTooltip, BaseButton },
    setup() {
      return { args };
    },
    template: `
      <div class="flex h-220 items-center justify-center">
        <BaseTooltip v-bind="args">
          Tooltip content
          <template #trigger>
            <BaseButton size="40">Hover or tap</BaseButton>
          </template>
        </BaseTooltip>
      </div>
    `,
  }),
};

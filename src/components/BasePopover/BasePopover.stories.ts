import BaseButton from '../BaseButton/BaseButton.vue';
import BasePopover from './BasePopover.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Base/BasePopover',
  component: BasePopover,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    side: { control: 'select', options: ['bottom', 'top', 'right', 'left'] },
    sideOffset: { control: 'number' },
    collisionPadding: { control: 'number' },
  },
  args: {
    align: 'center',
    side: 'bottom',
    sideOffset: 8,
    collisionPadding: 24,
  },
} satisfies Meta<typeof BasePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { BasePopover, BaseButton },
    setup() {
      return { args };
    },
    template: `
      <BasePopover v-bind="args">
        <template #trigger>
          <BaseButton>Click</BaseButton>
        </template>
        <template #content="{ close }">
          <div class="flex size-200 flex-col items-center justify-center gap-12">
            <div>Content</div>
            <BaseButton size="32" color="gray" @click="close()">Close</BaseButton>
          </div>
        </template>
      </BasePopover>
    `,
  }),
};

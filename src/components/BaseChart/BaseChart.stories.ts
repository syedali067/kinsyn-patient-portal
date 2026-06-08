import BaseChart from './BaseChart.vue';
import type { BaseChartItem } from './types';
import type { Meta, StoryObj } from '@storybook/vue3';

const lineData = [
  [
    { date: new Date('01/02/2024'), value: 300 },
    { date: new Date('01/01/2024'), value: 0 },
    { date: new Date('01/03/2024'), value: 300 },
    { date: new Date('01/04/2024'), value: 500 },
    { date: new Date('01/05/2024'), value: 1000 },
    { date: new Date('01/06/2024'), value: 500 },
    { date: new Date('01/07/2024'), value: 200 },
    { date: new Date('01/08/2024'), value: 500 },
  ],
  [
    { date: new Date('01/03/2024'), value: 600 },
    { date: new Date('01/04/2024'), value: 800 },
    { date: new Date('01/05/2024'), value: 600 },
    { date: new Date('01/06/2024'), value: 800 },
    { date: new Date('01/07/2024'), value: 600 },
    { date: new Date('01/15/2024'), value: 800 },
  ],
] satisfies BaseChartItem[][];

const meta = {
  title: 'Base/BaseChart',
  component: BaseChart,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line-indexed'], // Only line-indexed is supported for now
    },
    dateFormat: {
      control: 'select',
      options: ['day', 'weekday', 'month'],
    },
    curve: {
      control: 'select',
      options: ['curveBumpX', 'curveLinear', 'curveCatmullRom'],
    },
    xAxis: { control: 'boolean' },
    yAxis: { control: 'boolean' },
    points: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
  args: {
    type: 'line-indexed',
    dateFormat: 'day',
    curve: 'curveCatmullRom',
    xAxis: false,
    yAxis: false,
    points: false,
    maxLength: 10,
  },
} satisfies Meta<typeof BaseChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Data: Story = {
  render: (args) => ({
    components: { BaseChart },
    setup() {
      const data = lineData;

      return { args, data };
    },
    template: `
      <BaseChart v-bind="args" :data class="h-290" />
    `,
  }),
};

<script setup lang="ts">
import { useLineIndexedChart } from './composables/useLineIndexedChart';
import type {
  BaseChartType,
  BaseChartDateFormat,
  BaseChartItem,
  BaseChartItemWithDate,
  BaseChartCurve,
} from './types';
import * as d3 from 'd3';
import { parseISO } from 'date-fns';
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    data?: BaseChartItem[] | BaseChartItem[][];
    groups?: string[];
    type?: BaseChartType;
    dateFormat?: BaseChartDateFormat;
    curve?: BaseChartCurve;
    xAxis?: boolean;
    yAxis?: boolean;
    points?: boolean;
    maxLength?: number;
  }>(),
  {
    data: () => [],
    groups: () => ['value'],
    type: 'line',
    dateFormat: 'day',
    curve: 'curveLinear',
    xAxis: false,
    yAxis: false,
    points: false,
    maxLength: 0,
  },
);

const containerRef = ref<HTMLElement | null>(null);

const dataArray = computed<BaseChartItemWithDate[][]>(() => {
  const nestedArray = (
    Array.isArray(props.data[0]) ? props.data : [props.data]
  ) as BaseChartItem[][];

  return nestedArray.map((array) => {
    return array.map((data) => {
      return {
        ...data,
        date: typeof data.date === 'string' ? parseISO(data.date) : data.date,
      };
    });
  });
});

const size = reactive({
  width: 0,
  height: 0,
});

const margin = computed(() => {
  return {
    top: 0,
    right: 0,
    bottom: props.xAxis ? 20 : 0,
    left: props.yAxis ? 45 : 0,
  };
});

/* const timeFormat = computed(() => {
  return {
    day: '%e',
    weekday: '%a',
    month: '%b',
  }[props.dateFormat] as BaseChartDateFormat;
}); */

const xTicks = computed(() => {
  if (!props.xAxis) {
    return 0;
  }
  const count = Math.round(size.width * 0.01);
  return count < 4 ? 4 : count;
});

const yTicks = computed(() => {
  if (!props.yAxis) {
    return 0;
  }
  const count = Math.round(size.height * 0.025);
  return count < 4 ? 4 : count;
});

const { renderLineIndexedChart } = useLineIndexedChart(
  size,
  props.groups[0] ?? '',
  xTicks,
  yTicks,
  containerRef,
  props.curve,
  props.points,
  props.maxLength,
);

const renderChart = () => {
  if (!containerRef.value) {
    return;
  }

  containerRef.value.innerHTML = '';
  size.width = containerRef.value.clientWidth - margin.value.left - margin.value.right;
  size.height = containerRef.value.clientHeight - margin.value.top - margin.value.bottom;

  const svg = d3
    .select(containerRef.value)
    .append('svg')
    .attr('width', size.width + margin.value.left + margin.value.right)
    .attr('height', size.height + margin.value.top + margin.value.bottom)
    .attr('viewBox', [
      0,
      0,
      size.width + margin.value.left + margin.value.right,
      size.height + margin.value.top + margin.value.bottom,
    ])
    .append('g')
    .attr('transform', `translate(${margin.value.left},${margin.value.top})`);

  if (props.type === 'line-indexed') {
    renderLineIndexedChart(dataArray.value, svg);
  }
};

watch(
  () => [props.data, props.type, props.dateFormat, props.xAxis, props.yAxis],
  async () => {
    await nextTick();
    renderChart();
  },
  { deep: true },
);

onMounted(() => {
  if (!containerRef.value) {
    return;
  }

  size.width = containerRef.value.clientWidth - margin.value.left - margin.value.right;
  size.height = containerRef.value.clientHeight - margin.value.top - margin.value.bottom;

  renderChart();

  window.addEventListener('resize', renderChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderChart);
});
</script>

<template>
  <div ref="containerRef" class="relative" data-testpl="base-chart" />
</template>

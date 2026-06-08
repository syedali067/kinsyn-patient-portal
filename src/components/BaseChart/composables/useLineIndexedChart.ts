import type { BaseChartItemWithDate, BaseChartCurve } from '../types';
import * as d3 from 'd3';
import { addDays, format } from 'date-fns';
import { maxBy, minBy } from 'lodash-es';
import { onUnmounted, type ComputedRef, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const colors = ['var(--color-beige)'];
const lineWidth = 2;

export const useLineIndexedChart = (
  size: { width: number; height: number },
  group: string,
  xTicks: ComputedRef<number>,
  yTicks: ComputedRef<number>,
  containerRef: Ref<HTMLElement | null>,
  curve: BaseChartCurve,
  points: boolean,
  maxLength: number,
) => {
  const { t } = useI18n();

  const renderLineIndexedChart = (
    data: BaseChartItemWithDate[][],
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) => {
    const rawFlatData = data.flat();
    if (rawFlatData.length === 0) return;

    svg
      .append('rect')
      .attr('width', Math.max(0, size.width))
      .attr('height', Math.max(0, size.height))
      .attr('rx', 8)
      .attr('fill', 'var(--color-bone)')
      .attr('opacity', 0.5);

    const earliestDate = minBy(rawFlatData, (d) => d.date)!.date;
    const latestDate = maxBy(rawFlatData, (d) => d.date)!.date;

    // Add lines before the first point and after the last one
    const dataWithAdditions = data.map((dataArray) => {
      const sortedTrimmedDataArray = dataArray
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(-maxLength);
      const firstItem = sortedTrimmedDataArray[0];
      const lastItem = sortedTrimmedDataArray[sortedTrimmedDataArray.length - 1];

      return [
        {
          date: addDays(earliestDate, -1),
          [group]: firstItem?.[group] ?? 0,
        },
        ...sortedTrimmedDataArray,
        {
          date: addDays(latestDate, 1),
          [group]: lastItem?.[group] ?? 0,
        },
      ];
    });

    const flatData = dataWithAdditions.flat();
    const maxDataLength = Math.max(...dataWithAdditions.map((d) => d.length));

    // If there are more than 1 chart, make arrays of the same length
    if (dataWithAdditions.length > 1) {
      dataWithAdditions.forEach((dataArray) => {
        const lastItem = dataArray[dataArray.length - 1];

        dataArray.push(
          ...Array(maxDataLength - dataArray.length).fill({
            date: addDays(latestDate, 1),
            [group]: lastItem?.[group] ?? 0,
          }),
        );
      });
    }

    const x = d3
      .scaleLinear()
      .domain([0, maxDataLength - 1])
      .range([0, size.width]);

    const y = d3
      .scaleLinear()
      .domain([0, (d3.max(flatData, (d) => d[group]) as number) * 1.2])
      .range([size.height - 8, lineWidth]);

    if (yTicks.value > 0) {
      const tickValues = y.ticks(yTicks.value);

      svg
        .append('g')
        .attr('class', 'grid-lines')
        .selectAll('.horizontal-line')
        .data(tickValues)
        .enter()
        .append('line')
        .attr('class', 'horizontal-line')
        .attr('x1', 0)
        .attr('x2', size.width)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', 'var(--color-bone)')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 1)
        .attr('shape-rendering', 'crispEdges');
    }

    // Line
    const line = d3
      .line<BaseChartItemWithDate>()
      .x((_, i) => x(i))
      .y((d) => y(d[group] as number))
      .curve(d3[curve]);

    dataWithAdditions.forEach((dataArray, index) => {
      svg
        .append('path')
        .datum(dataArray)
        .attr('fill', 'none')
        .attr('stroke', colors[index % colors.length] ?? colors[0]!)
        .attr('stroke-width', lineWidth)
        .attr('d', line);
    });

    // Gradient
    const area = d3
      .area<BaseChartItemWithDate>()
      .x((_, i) => x(i))
      .y0(y(0))
      .y1((d) => y(d[group] as number))
      .curve(d3[curve]);

    dataWithAdditions.forEach((dataArray) => {
      svg
        .append('path')
        .datum(dataArray)
        .attr('fill', 'url(#gradient)')
        .attr('opacity', 0.5)
        .attr('d', area);
    });

    // Gradient defs
    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', size.width / 2)
      .attr('x2', size.width / 2)
      .attr('y1', 0)
      .attr('y2', size.height);

    linearGradient.append('stop').attr('stop-color', 'var(--color-beige)').attr('offset', '0%');
    linearGradient.append('stop').attr('stop-color', 'var(--color-beige)').attr('offset', '50%');
    linearGradient
      .append('stop')
      .attr('stop-color', 'var(--color-bone)')
      .attr('stop-opacity', 0)
      .attr('offset', '100%');

    // Points
    if (points) {
      // Create tooltip
      const tooltip = d3
        .select(containerRef.value)
        .append('div')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .attr(
          'class',
          `grid grid-cols-[1fr,auto] gap-4 items-center w-200 p-12 border border-bone rounded-8 bg-white shadow-sm whitespace-nowrap opacity-0`,
        );

      const tooltipDate = tooltip
        .append('p')
        .attr('class', 'col-span-2 text-14 text-secondary-text');

      const tooltipValue = tooltip.append('p').attr('class', 'text-14');

      const tooltipChange = tooltip
        .append('p')
        .attr('class', 'text-12 text-secondary-text')
        .style('opacity', 0);

      const hideTooltip = () => {
        if (tooltip) {
          tooltip.style('opacity', 0);
        }
      };

      // Add scroll event listener
      window.addEventListener('scroll', hideTooltip);

      onUnmounted(() => {
        window.removeEventListener('scroll', hideTooltip);
      });

      data.forEach((dataArray, index) => {
        const initialValue = +(dataArray[0]?.[group] ?? 0);

        svg
          .append('g')
          .selectAll('dot')
          .data(dataArray.slice(-maxLength))
          .join((enter) => {
            const g = enter.append('g');

            const color = colors[index % colors.length] ?? colors[0]!;

            g.append('circle')
              .attr('cx', (_, i) => x(i + 1))
              .attr('cy', (d) => y(d[group] as number))
              .attr('r', 8.75)
              .attr('fill', 'transparent')
              .attr('stroke', color)
              .attr('stroke-width', lineWidth)
              .attr('opacity', 0);

            g.append('circle')
              .attr('cx', (_, i) => x(i + 1))
              .attr('cy', (d) => y(d[group] as number))
              .attr('r', 4.25)
              .attr('fill', 'var(--color-white)')
              .attr('stroke', color)
              .attr('stroke-width', lineWidth);

            return g;
          })
          .on('mouseenter', (e, d) => {
            if (!tooltip || !tooltipDate || !tooltipValue || !tooltipChange) return;

            e.target.children[0].style.opacity = 0.2;

            tooltipDate.text(format(d.date, 'MMMM d, y'));

            const dValue = +(d[group] ?? 0);

            tooltipValue.text(
              t('weightLbs', {
                value: dValue,
              }),
            );

            if (containerRef.value) {
              const containerRect = containerRef.value.getBoundingClientRect();
              const mouseX = e.clientX - containerRect.left;
              const mouseY = e.clientY - containerRect.top;
              const tooltipWidth = 200;
              const tooltipOffset = 8;
              const tooltipHeight = 60;

              // Change tooltip position if there is not enough space
              const fitsRight = containerRect.width - mouseX > tooltipWidth + tooltipOffset;
              const fitsTop = mouseY > tooltipHeight;

              tooltip
                .style(
                  'left',
                  fitsRight
                    ? `${mouseX + tooltipOffset}px`
                    : `${mouseX - tooltipWidth - tooltipOffset}px`,
                )
                .style('top', fitsTop ? `${mouseY - tooltipHeight}px` : `${mouseY + 20}px`)
                .style('opacity', 1);
            }

            if (dValue > initialValue) {
              tooltipChange.text(t('weightUp', { value: Math.round(dValue - initialValue) }));
              tooltipChange.style('opacity', 1);
            } else if (dValue < initialValue) {
              tooltipChange.text(t('weightDown', { value: Math.round(initialValue - dValue) }));
              tooltipChange.style('opacity', 1);
            } else {
              tooltipChange.style('opacity', 0);
            }
          })
          .on('mouseleave', (e) => {
            hideTooltip();
            e.target.children[0].style.opacity = 0;
          });
      });
    }

    // X axis
    if (xTicks.value > 0) {
      svg
        .append('g')
        .attr('transform', `translate(0,${size.height})`)
        .call(
          d3
            .axisBottom<number>(x)
            .ticks(xTicks.value)
            .tickSize(0)
            .tickPadding(8)
            .tickFormat((i) => Math.round(i).toString()),
        )
        .call((g) => g.select('.domain').remove())
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('font-family', 'Neue Haas Grotesk Text, sans-serif')
        .attr('font-weight', 400)
        .attr('color', 'var(--color-stone)');
    }

    // Y axis
    if (yTicks.value > 0) {
      svg
        .append('g')
        .call(d3.axisLeft(y).ticks(yTicks.value).tickSize(0).tickPadding(10))
        .call((g) => {
          g.select('.domain').remove();
          g.select('.tick:last-child').remove();
        })
        .attr('font-size', '12px')
        .attr('font-family', 'Neue Haas Grotesk Text, sans-serif')
        .attr('color', 'var(--color-secondary-text)');
    }
  };

  return {
    renderLineIndexedChart,
  };
};

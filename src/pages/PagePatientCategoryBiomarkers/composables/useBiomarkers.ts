import type { Biomarker } from '@/types/health.ts';

export const useBiomarkers = () => {
  const getRangeParts = (range: string) => {
    if (!range || !range.includes('-')) return [0, 0];
    return range.split('-').map((n) => parseFloat(n));
  };

  const hasNumericRange = (item: Biomarker) => {
    return (
      item.referenceRange &&
      item.referenceRange.includes('-') &&
      !isNaN(parseFloat(item.referenceRange.split('-')[0] ?? '')) &&
      !isNaN(parseFloat(item.referenceRange.split('-')[1] ?? ''))
    );
  };

  // Check if value is a pure number (e.g., "4.2", "5" - true, "<1.3", "3.5>" - false)
  const isNumericValue = (item: Biomarker) => /^-?\d+(\.\d+)?$/.test(item.parameterValue);

  const getMinValue = (item: Biomarker) => {
    const [rangeMin] = getRangeParts(item.referenceRange);
    const value = parseFloat(item.parameterValue);

    if (item.rangeDescription.includes('In range')) {
      return rangeMin;
    }

    if (item.rangeDescription.includes('Above range')) {
      return rangeMin;
    }

    if (item.rangeDescription.includes('Below range')) {
      return value;
    }

    return rangeMin;
  };

  const getMaxValue = (item: Biomarker) => {
    const [rangeMax] = getRangeParts(item.referenceRange);
    const value = parseFloat(item.parameterValue);

    if (item.rangeDescription.includes('In range')) {
      return rangeMax;
    }

    if (item.rangeDescription.includes('Above range')) {
      return value;
    }

    if (item.rangeDescription.includes('Below range')) {
      return rangeMax;
    }

    return rangeMax;
  };

  const getLeftRedWidth = (item: Biomarker) => {
    if (item.rangeDescription.includes('In range')) {
      return 0;
    }

    if (item.rangeDescription.includes('Above range')) {
      return 0;
    }

    if (item.rangeDescription.includes('Below range')) {
      return 100 - getGreenWidth(item);
    }

    return 0;
  };

  const getGreenWidth = (item: Biomarker) => {
    if (item.rangeDescription.includes('In range')) {
      return 100;
    }

    if (
      item.rangeDescription.includes('Above range') ||
      item.rangeDescription.includes('Below range')
    ) {
      return 20;
    }

    return 100;
  };

  const getRightRedWidth = (item: Biomarker) => {
    if (item.rangeDescription.includes('In range')) {
      return 0;
    }

    if (item.rangeDescription.includes('Above range')) {
      return 100 - getGreenWidth(item);
    }

    if (item.rangeDescription.includes('Below range')) {
      return 0;
    }

    return 0;
  };

  const getMarkerPosition = (item: Biomarker) => {
    const [rangeMin = 0, rangeMax = 0] = getRangeParts(item.referenceRange);
    const value = parseFloat(item.parameterValue);

    if (rangeMax === rangeMin) return 50;

    if (item.rangeDescription.includes('In range')) {
      let position = ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

      if (position < 15) position = 15;
      if (position > 85) position = 85;

      return position;
    }

    const minValue = getMinValue(item) ?? 0;
    const maxValue = getMaxValue(item) ?? 0;

    let position = ((value - minValue) / (maxValue - minValue)) * 100;

    if (position < 15) position = 15;
    if (position > 85) position = 85;

    return position;
  };

  const getStatusClass = (item: Biomarker) => {
    if (item.rangeDescription.includes('Above range')) return 'above';
    if (item.rangeDescription.includes('Below range')) return 'below';
    return 'in-range';
  };

  return {
    getRangeParts,
    getMinValue,
    getMaxValue,
    getLeftRedWidth,
    getGreenWidth,
    getRightRedWidth,
    getMarkerPosition,
    getStatusClass,
    hasNumericRange,
    isNumericValue,
  };
};

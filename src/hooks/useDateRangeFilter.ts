
import { useState, useEffect } from 'react';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export type DateRange = {
  from: Date;
  to: Date;
};

export const useDateRangeFilter = (initialRange?: DateRange) => {
  const today = new Date();
  const defaultRange: DateRange = {
    from: subDays(today, 30), // Default to last 30 days
    to: today,
  };

  const [dateRange, setDateRange] = useState<DateRange>(initialRange || defaultRange);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedRange = localStorage.getItem('dashboard-date-range');
    if (savedRange && !initialRange) {
      try {
        const parsedRange = JSON.parse(savedRange);
        setDateRange({
          from: new Date(parsedRange.from),
          to: new Date(parsedRange.to),
        });
      } catch (e) {
        console.error('Failed to parse saved date range:', e);
      }
    }
  }, [initialRange]);

  // Update date range with normalization
  const updateDateRange = (range: DateRange) => {
    const normalizedRange = {
      from: startOfDay(range.from),
      to: endOfDay(range.to),
    };
    
    setDateRange(normalizedRange);
    localStorage.setItem('dashboard-date-range', JSON.stringify({
      from: normalizedRange.from.toISOString(),
      to: normalizedRange.to.toISOString(),
    }));
  };

  return {
    dateRange,
    updateDateRange,
    startDate: dateRange.from,
    endDate: dateRange.to
  };
};

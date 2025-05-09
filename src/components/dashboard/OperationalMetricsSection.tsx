import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { OperationalMetric } from '@/types/dashboard';
interface OperationalMetricsSectionProps {
  metrics: OperationalMetric[];
  departments: Array<{
    id: string;
    name: string;
  }>;
}
export function OperationalMetricsSection({
  metrics,
  departments
}: OperationalMetricsSectionProps) {
  // Group metrics by type
  const productivityMetrics = metrics.filter(m => m.type === 'productivity');
  const qualityMetrics = metrics.filter(m => m.type === 'quality');
  const inventoryMetrics = metrics.filter(m => m.type === 'inventory');

  // Prepare data for the productivity heatmap
  const productivityByDepartment = departments.map(dept => {
    const deptMetric = productivityMetrics.find(m => m.departmentId === dept.id);
    return {
      name: dept.name,
      value: deptMetric?.value || 0,
      target: deptMetric?.targetValue || 0
    };
  });

  // Calculate progress percentage for each metric
  const calculateProgressPercentage = (value: number, target?: number) => {
    if (!target) return 0;
    return Math.min(100, Math.round(value / target * 100));
  };
  return;
}
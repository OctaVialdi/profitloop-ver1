
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { OperationalMetric } from '@/types/dashboard';

interface OperationalMetricCardProps {
  metric: OperationalMetric;
}

interface OperationalMetricsSectionProps {
  metrics: OperationalMetric[];
}

const metricTrendData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 59 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 81 },
  { month: 'May', value: 76 },
  { month: 'Jun', value: 85 },
];

const OperationalMetricCard: React.FC<OperationalMetricCardProps> = ({ metric }) => {
  const progress = metric.target_value
    ? Math.min(100, (metric.metric_value / metric.target_value) * 100)
    : 50; // Default to 50% if no target

  return (
    <Card>
      <CardHeader>
        <CardTitle>{metric.metric_name}</CardTitle>
        <CardDescription>
          {metric.unit ? `Measured in ${metric.unit}` : 'Performance metric'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {metric.metric_value}{metric.unit ? ` ${metric.unit}` : ''}
        </div>
        
        {metric.target_value && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
            <div className="text-xs text-muted-foreground mt-1">
              Target: {metric.target_value}{metric.unit ? ` ${metric.unit}` : ''}
            </div>
          </div>
        )}

        <div className="h-[100px] mt-4">
          <ChartContainer config={{
            value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const OperationalMetricsSection: React.FC<OperationalMetricsSectionProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
          <CardDescription>No metrics available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Operational metrics will appear here once data is available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Operational Metrics</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <OperationalMetricCard key={metric.id || metric.metric_name} metric={metric} />
        ))}
      </div>
    </div>
  );
};

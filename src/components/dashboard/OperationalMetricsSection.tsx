
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { OperationalMetric } from '@/types/dashboard';

interface OperationalMetricsSectionProps {
  metrics: OperationalMetric[];
}

export const OperationalMetricsSection: React.FC<OperationalMetricsSectionProps> = ({ metrics }) => {
  // Group metrics by type
  const efficiencyMetrics = metrics.filter(m => m.metric_type === 'efficiency');
  const qualityMetrics = metrics.filter(m => m.metric_type === 'quality');
  
  // Sample data for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (metrics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No operational metrics data available.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Efficiency Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Efficiency Metrics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Efficiency Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Department</CardTitle>
              <CardDescription>Efficiency scores across teams</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] p-4">
                <ChartContainer config={{
                  value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={efficiencyMetrics.length > 0 ? efficiencyMetrics : [
                        {id: '1', metric_name: 'HR', metric_value: 85, metric_type: 'efficiency'},
                        {id: '2', metric_name: 'Sales', metric_value: 92, metric_type: 'efficiency'},
                        {id: '3', metric_name: 'IT', metric_value: 78, metric_type: 'efficiency'},
                        {id: '4', metric_name: 'Finance', metric_value: 88, metric_type: 'efficiency'}
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="metric_name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar 
                        dataKey="metric_value" 
                        name="Score" 
                        fill="var(--color-value)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quality Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics</CardTitle>
              <CardDescription>Performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] p-4">
                <ChartContainer config={{
                  value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={qualityMetrics.length > 0 ? qualityMetrics : [
                        {id: '1', metric_name: 'Defect Rate', metric_value: 2.3, metric_type: 'quality'},
                        {id: '2', metric_name: 'Customer Satisfaction', metric_value: 4.7, metric_type: 'quality'},
                        {id: '3', metric_name: 'SLA Compliance', metric_value: 98.2, metric_type: 'quality'},
                        {id: '4', metric_name: 'On-time Delivery', metric_value: 94.6, metric_type: 'quality'}
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric_name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="metric_value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { OperationalMetric } from '@/types/dashboard';

interface OperationalMetricsSectionProps {
  metrics: OperationalMetric[];
  departments: Array<{ id: string; name: string }>;
}

export function OperationalMetricsSection({ metrics, departments }: OperationalMetricsSectionProps) {
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
    return Math.min(100, Math.round((value / target) * 100));
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Operational BSC</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Productivity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
            <CardDescription>Output per Team/Hour</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ 
              value: { theme: { light: '#2563eb', dark: '#3b82f6' } },
              target: { theme: { light: '#ef4444', dark: '#f87171' } }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productivityByDepartment}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Actual" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Quality</CardTitle>
            <CardDescription>Error Rate & Rework Cost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityMetrics.length > 0 ? (
                qualityMetrics.map(metric => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <div className="text-sm">
                        <span>
                          {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
                        </span>
                        {metric.targetValue && (
                          <span className="text-muted-foreground ml-2">
                            of {metric.targetValue}{metric.unit ? ` ${metric.unit}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {metric.targetValue && (
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 ${
                            metric.name.toLowerCase().includes('error') || metric.name.toLowerCase().includes('rework')
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${calculateProgressPercentage(metric.value, metric.targetValue)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No quality metrics available. Add your first metric.
                </div>
              )}

              {/* Sample Pareto Chart for Root Cause Analysis */}
              {qualityMetrics.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Root Cause Analysis</h4>
                  <div className="h-[150px]">
                    <ChartContainer config={{
                      value: { theme: { light: '#ef4444', dark: '#f87171' } }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Material', value: 35 },
                            { name: 'Process', value: 28 },
                            { name: 'Human', value: 20 },
                            { name: 'Machine', value: 12 },
                            { name: 'Method', value: 5 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" name="Issues" fill="var(--color-value)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Turnover Ratio & Aging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryMetrics.length > 0 ? (
                inventoryMetrics.map(metric => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <div className="text-sm">
                        <span>
                          {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
                        </span>
                        {metric.targetValue && (
                          <span className="text-muted-foreground ml-2">
                            of {metric.targetValue}{metric.unit ? ` ${metric.unit}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {metric.targetValue && (
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-green-500"
                          style={{ 
                            width: `${calculateProgressPercentage(metric.value, metric.targetValue)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No inventory metrics available. Add your first metric.
                </div>
              )}

              {/* Sample Inventory Aging */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Inventory Aging (Days)</h4>
                <div className="h-[150px]">
                  <ChartContainer config={{
                    value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Raw Material', value: 12 },
                          { name: 'WIP', value: 5 },
                          { name: 'Finished Goods', value: 15 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="Days" fill="var(--color-value)">
                          {/* Custom color for inventory aging warning */}
                          {[
                            <Cell key="cell-0" fill="#4ade80" />,
                            <Cell key="cell-1" fill="#4ade80" />,
                            <Cell key="cell-2" fill="#f87171" /> // Warning for aged inventory
                          ]}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

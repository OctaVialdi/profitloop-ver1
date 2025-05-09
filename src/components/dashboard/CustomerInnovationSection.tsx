
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomerMetric, InnovationMetric } from '@/types/dashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface CustomerInnovationSectionProps {
  customerMetrics: CustomerMetric[];
  innovationMetrics: InnovationMetric[];
}

export function CustomerInnovationSection({ customerMetrics, innovationMetrics }: CustomerInnovationSectionProps) {
  // Filter customer metrics by type
  const satisfactionMetrics = customerMetrics.filter(m => m.type === 'satisfaction');
  const retentionMetrics = customerMetrics.filter(m => m.type === 'retention');
  
  // Filter innovation metrics by type
  const trainingMetrics = innovationMetrics.filter(m => m.type === 'training');
  const technologyMetrics = innovationMetrics.filter(m => m.type === 'technology');
  
  // Calculate average satisfaction score (e.g., CSAT)
  const avgCSAT = satisfactionMetrics.length > 0
    ? satisfactionMetrics.reduce((sum, metric) => sum + metric.value, 0) / satisfactionMetrics.length
    : 0;
  
  // Customer feedback word cloud (simulated)
  const feedbackWords = [
    { text: 'Excellent', value: 30 },
    { text: 'Responsive', value: 25 },
    { text: 'Quality', value: 20 },
    { text: 'Expensive', value: 15 },
    { text: 'Innovative', value: 10 },
    { text: 'Reliable', value: 5 }
  ];
  
  // Generate complaint categories (simulated)
  const complaintCategories = [
    { name: 'Product Quality', value: 45 },
    { name: 'Delivery Time', value: 30 },
    { name: 'Customer Service', value: 15 },
    { name: 'Pricing', value: 10 }
  ];
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Customer BSC Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Customer BSC</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>CSAT & NPS Scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* CSAT Score */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">CSAT Score</h4>
                  <span className="text-lg font-bold">{avgCSAT.toFixed(1)}/5</span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-blue-500"
                    style={{ width: `${(avgCSAT / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* NPS Score */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Net Promoter Score</h4>
                  <span className="text-lg font-bold">42</span>
                </div>
                <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full">
                  <div className="bg-red-500 h-2" style={{ width: '30%' }} /> {/* Detractors */}
                  <div className="bg-yellow-500 h-2" style={{ width: '20%' }} /> {/* Passives */}
                  <div className="bg-green-500 h-2" style={{ width: '50%' }} /> {/* Promoters */}
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span>Detractors</span>
                  <span>Passives</span>
                  <span>Promoters</span>
                </div>
              </div>
              
              {/* Customer Feedback Word Cloud */}
              <div>
                <h4 className="text-sm font-medium mb-2">Feedback Analysis</h4>
                <div className="bg-gray-50 p-4 rounded-md flex flex-wrap items-center justify-center">
                  {feedbackWords.map((word) => (
                    <div 
                      key={word.text}
                      className="m-1 p-1 rounded"
                      style={{ 
                        fontSize: `${Math.max(0.8, Math.min(2, word.value / 10 + 0.8))}rem`,
                        opacity: word.value / 30 + 0.5,
                        color: word.text === 'Expensive' ? '#ef4444' : '#3b82f6'
                      }}
                    >
                      {word.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
            <CardDescription>Churn & Repeat Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Churn Rate Trend */}
              <div>
                <h4 className="text-sm font-medium mb-2">Customer Churn Rate</h4>
                <ChartContainer config={{
                  value: { theme: { light: '#ef4444', dark: '#f87171' } }
                }} className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', value: 4.2 },
                        { month: 'Feb', value: 3.8 },
                        { month: 'Mar', value: 3.9 },
                        { month: 'Apr', value: 3.5 },
                        { month: 'May', value: 3.2 },
                        { month: 'Jun', value: 3.0 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Churn %"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Complaint Categories */}
              <div>
                <h4 className="text-sm font-medium mb-2">Complaint Analysis</h4>
                <ChartContainer config={{
                  value: { theme: { light: '#2563eb', dark: '#3b82f6' } }
                }} className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complaintCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={30}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {complaintCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Innovation BSC Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Innovation & Growth BSC</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Development</CardTitle>
            <CardDescription>Training & Skills Metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Training Hours */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Avg. Training Hours/Employee</h4>
                  <span className="text-lg font-bold">
                    {trainingMetrics.length > 0 
                      ? (trainingMetrics.reduce((sum, m) => sum + m.value, 0) / trainingMetrics.length).toFixed(1)
                      : '0'} hours
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-purple-500"
                    style={{ width: `${Math.min(100, (trainingMetrics[0]?.value || 0) / 40 * 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Target: 40 hours per quarter
                </div>
              </div>
              
              {/* Skill Gap Analysis */}
              <div>
                <h4 className="text-sm font-medium mb-2">Skill Gap Analysis</h4>
                <div className="space-y-2">
                  {[
                    { skill: 'Technical Skills', current: 75, target: 85 },
                    { skill: 'Leadership', current: 60, target: 80 },
                    { skill: 'Communication', current: 80, target: 85 },
                    { skill: 'Problem Solving', current: 70, target: 75 }
                  ].map(item => (
                    <div key={item.skill} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{item.skill}</span>
                        <span className="text-muted-foreground">{item.current}% of {item.target}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-1.5 bg-indigo-500"
                          style={{ width: `${(item.current / item.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Innovation & Technology</CardTitle>
            <CardDescription>New Ideas & Systems Uptime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* New Ideas/Projects */}
              <div>
                <h4 className="text-sm font-medium mb-2">New Ideas Submitted</h4>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                    +4 this month
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-xs">
                    <span className="font-medium">12</span> under review
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">8</span> approved
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">4</span> implemented
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">4</span> rejected
                  </div>
                </div>
              </div>
              
              {/* System Uptime */}
              <div>
                <h4 className="text-sm font-medium mb-2">System Uptime & Automation</h4>
                <div className="space-y-2">
                  {technologyMetrics.length > 0 ? (
                    technologyMetrics.map(metric => (
                      <div key={metric.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{metric.name}</span>
                          <span>{metric.value}{metric.unit ? ` ${metric.unit}` : ''}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-1.5 ${metric.name.includes('Uptime') ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      No technology metrics available
                    </div>
                  )}
                  
                  {/* Mock Data for System Uptime */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>System Uptime</span>
                      <span>99.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-1.5 bg-green-500"
                        style={{ width: '99.8%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Mock Data for Process Automation */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Process Automation Rate</span>
                      <span>65%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-1.5 bg-blue-500"
                        style={{ width: '65%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

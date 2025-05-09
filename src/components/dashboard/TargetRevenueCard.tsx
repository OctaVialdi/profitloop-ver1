
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface TargetRevenueCardProps {
  currentRevenue: number;
  targetRevenue: number;
  onUpdateTarget: (newTarget: number) => void;
}

export function TargetRevenueCard({ currentRevenue, targetRevenue, onUpdateTarget }: TargetRevenueCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(targetRevenue.toString());

  // Calculate progress percentage
  const progressPercentage = targetRevenue > 0 
    ? Math.min(Math.round((currentRevenue / targetRevenue) * 100), 100) 
    : 0;
  
  const remainingPercentage = 100 - progressPercentage;
  
  const chartData = [
    { name: 'Current', value: progressPercentage > 0 ? progressPercentage : 0 },
    { name: 'Remaining', value: remainingPercentage > 0 ? remainingPercentage : 100 },
  ];
  
  // Colors for the pie chart
  const COLORS = ['#4ade80', '#ef4444']; // Green for achieved, red for remaining
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleSave = () => {
    const parsedValue = parseFloat(newTarget.replace(/[^\d]/g, ''));
    if (!isNaN(parsedValue)) {
      onUpdateTarget(parsedValue);
    }
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and formatting
    const value = e.target.value.replace(/[^\d]/g, '');
    setNewTarget(value);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-background pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Target Revenue</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  current: { theme: { light: '#4ade80', dark: '#4ade80' } },
                  remaining: { theme: { light: '#ef4444', dark: '#ef4444' } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {progressPercentage}% dari target tercapai
            </div>
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Current:</div>
              <div className="text-2xl font-bold">{formatCurrency(currentRevenue)}</div>
            </div>
            
            {isEditing ? (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Target:</div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={newTarget}
                      onChange={handleInputChange}
                      className="pl-8"
                      autoFocus
                    />
                  </div>
                  <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Target:</div>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(targetRevenue)}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';

interface GoalCardProps {
  name: string;
  targetAmount: number;
  currentProgress: number;
  deadline: string;
  isCritical: boolean;
  icon?: string;
}

export function GoalCard({
  name,
  targetAmount,
  currentProgress,
  deadline,
  isCritical,
  icon = '🎯'
}: GoalCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.round((currentProgress / targetAmount) * 100)
  );
  
  const daysRemaining = React.useMemo(() => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [deadline]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className={`${isCritical ? 'border-red-500 border-2' : ''} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Goal icon">
              {icon}
            </span>
            <CardTitle className="text-sm font-medium">{name}</CardTitle>
          </div>
          {isCritical && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
              Critical
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Target: {formatCurrency(targetAmount)}</span>
            <span className="font-semibold">
              {progressPercentage}%
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Current: {formatCurrency(currentProgress)}</div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> 
              <span className={daysRemaining < 7 ? 'text-red-500 font-medium' : ''}>
                {daysRemaining} days left
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

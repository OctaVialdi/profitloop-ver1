
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserPlus, UserMinus, Calendar } from 'lucide-react';

interface PeriodStats {
  period: string;
  totalEmployees: number;
  newHires: number;
  leaving: number;
}

interface EmployeeStatsProps {
  periodStats: PeriodStats;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({ periodStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900/30 hover:shadow-sm transition-all duration-200">
        <CardContent className="p-3 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 mr-3">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
            <p className="text-2xl font-bold">{periodStats.totalEmployees}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900/30 hover:shadow-sm transition-all duration-200">
        <CardContent className="p-3 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2 mr-3">
            <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">New Hires</p>
            <p className="text-2xl font-bold">{periodStats.newHires}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900/30 hover:shadow-sm transition-all duration-200">
        <CardContent className="p-3 flex items-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 mr-3">
            <UserMinus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Leaving</p>
            <p className="text-2xl font-bold">{periodStats.leaving}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-900/30 hover:shadow-sm transition-all duration-200">
        <CardContent className="p-3 flex items-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 mr-3">
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Period</p>
            <p className="text-lg font-bold">{periodStats.period}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

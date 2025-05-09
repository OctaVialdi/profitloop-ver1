
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Percent, Award, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { calculateHRMetrics } from "@/utils/hrDashboardUtils";

interface HRMetricsGridProps {
  employees: Employee[];
}

export function HRMetricsGrid({ employees }: HRMetricsGridProps) {
  const metrics = calculateHRMetrics(employees);
  
  const metricsCards = useMemo(() => [
    {
      title: "Total Salary",
      value: `$${(metrics.totalSalary).toLocaleString()}`,
      icon: DollarSign,
      trend: "+5.2%",
      trendType: "up",
      color: "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
      description: "Combined monthly salary expenditure across all departments"
    },
    {
      title: "Total Bonus",
      value: `$${(metrics.totalBonus).toLocaleString()}`,
      icon: Award,
      trend: "+2.1%",
      trendType: "up",
      color: "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400",
      description: "Performance-based bonuses paid this quarter"
    },
    {
      title: "Sick Days",
      value: metrics.totalSickDays.toString(),
      icon: Calendar,
      trend: "-1.5%",
      trendType: "down",
      color: "bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
      description: "Total sick days taken in current month"
    },
    {
      title: "Avg. Sick Days",
      value: metrics.averageSickDays.toFixed(1),
      icon: Calendar,
      trend: "-0.8%",
      trendType: "down",
      color: "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
      description: "Average sick days taken per employee"
    },
    {
      title: "Total Employees",
      value: metrics.totalEmployees.toString(),
      icon: Users,
      trend: "+3.2%",
      trendType: "up",
      color: "bg-sky-100 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400",
      description: "Current active employee headcount"
    },
    {
      title: "Total Compensation",
      value: `$${(metrics.totalCompensation).toLocaleString()}`,
      icon: DollarSign,
      trend: "+4.7%",
      trendType: "up",
      color: "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400",
      description: "Total salary, bonus, and benefits package"
    },
    {
      title: "Commission",
      value: `$${(metrics.totalCommission).toLocaleString()}`,
      icon: Percent,
      trend: "+6.3%",
      trendType: "up",
      color: "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      description: "Sales commission payouts this month"
    },
    {
      title: "Avg. Salary",
      value: `$${(metrics.averageSalary).toLocaleString()}`,
      icon: TrendingUp,
      trend: "+2.5%",
      trendType: "up",
      color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
      description: "Average base salary per employee"
    }
  ], [metrics]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {metricsCards.map((metric, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-4 relative">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className={`text-xs font-medium flex items-center cursor-help px-2 py-0.5 rounded-full ${
                    metric.trendType === "up" 
                      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                      : "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30"
                  }`}>
                    {metric.trendType === "up" ? (
                      <ChevronUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ChevronDown className="w-3 h-3 mr-0.5" />
                    )}
                    {metric.trend}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="top" className="w-72 p-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{metric.title} Details</h4>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                    <p className="text-xs text-muted-foreground/80 pt-2">
                      Compared to previous period: {metric.trend} ({metric.trendType === "up" ? "increase" : "decrease"})
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">{metric.title}</p>
              <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

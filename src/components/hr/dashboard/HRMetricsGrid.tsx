
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, DollarSign, Calendar, Percent, Award, 
  TrendingUp, ChevronUp, ChevronDown 
} from "lucide-react";
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
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100/70 dark:bg-blue-900/20",
      description: "Combined monthly salary expenditure"
    },
    {
      title: "Total Bonus",
      value: `$${(metrics.totalBonus).toLocaleString()}`,
      icon: Award,
      trend: "+2.1%",
      trendType: "up",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100/70 dark:bg-green-900/20",
      description: "Performance-based bonuses"
    },
    {
      title: "Sick Days",
      value: metrics.totalSickDays.toString(),
      icon: Calendar,
      trend: "-1.5%",
      trendType: "down",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100/70 dark:bg-amber-900/20",
      description: "Total sick days this month"
    },
    {
      title: "Avg. Sick Days",
      value: metrics.averageSickDays.toFixed(1),
      icon: Calendar,
      trend: "-0.8%",
      trendType: "down",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100/70 dark:bg-purple-900/20",
      description: "Average per employee"
    },
    {
      title: "Total Employees",
      value: metrics.totalEmployees.toString(),
      icon: Users,
      trend: "+3.2%",
      trendType: "up",
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100/70 dark:bg-sky-900/20",
      description: "Current active headcount"
    },
    {
      title: "Total Compensation",
      value: `$${(metrics.totalCompensation).toLocaleString()}`,
      icon: DollarSign,
      trend: "+4.7%",
      trendType: "up",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100/70 dark:bg-indigo-900/20",
      description: "Salary, bonus & benefits"
    },
    {
      title: "Commission",
      value: `$${(metrics.totalCommission).toLocaleString()}`,
      icon: Percent,
      trend: "+6.3%",
      trendType: "up",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100/70 dark:bg-rose-900/20",
      description: "Commission payouts"
    },
    {
      title: "Avg. Salary",
      value: `$${(metrics.averageSalary).toLocaleString()}`,
      icon: TrendingUp,
      trend: "+2.5%",
      trendType: "up",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100/70 dark:bg-emerald-900/20",
      description: "Average base salary"
    }
  ], [metrics]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
      {metricsCards.map((metric, index) => (
        <Card key={index} className="overflow-hidden h-full border border-muted/60 shadow-sm group hover:shadow-md transition-all duration-200">
          <CardContent className="p-3 relative h-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-muted/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-center mb-1.5">
              <div className={`p-1.5 rounded-md ${metric.bgColor} ${metric.color}`}>
                <metric.icon className="w-3.5 h-3.5" />
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className={`text-xs font-medium flex items-center cursor-help px-1.5 py-0.5 rounded-full ${
                    metric.trendType === "up" 
                      ? "text-green-600 bg-green-100/70 dark:text-green-400 dark:bg-green-900/20" 
                      : "text-blue-600 bg-blue-100/70 dark:text-blue-400 dark:bg-blue-900/20"
                  }`}>
                    {metric.trendType === "up" ? (
                      <ChevronUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ChevronDown className="w-3 h-3 mr-0.5" />
                    )}
                    {metric.trend}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="top" className="w-64 p-3 text-xs">
                  <p className="font-medium mb-1">{metric.title}</p>
                  <p className="text-muted-foreground">{metric.description}</p>
                  <p className="text-muted-foreground/80 pt-1 mt-1 border-t border-border/50">
                    Compared to previous period: {metric.trend} ({metric.trendType === "up" ? "increase" : "decrease"})
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">{metric.title}</p>
              <p className="text-base font-bold">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

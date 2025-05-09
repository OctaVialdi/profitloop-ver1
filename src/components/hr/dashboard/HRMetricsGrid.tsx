
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Percent, Award, TrendingUp } from "lucide-react";
import { Employee } from "@/hooks/useEmployees";

interface HRMetricsGridProps {
  employees: Employee[];
}

export function HRMetricsGrid({ employees }: HRMetricsGridProps) {
  const metrics = useMemo(() => {
    // Calculate metrics from employee data
    const totalEmployees = employees.length;
    
    // These would be calculated from actual employee data in a real app
    // For now, we'll use mock values based on the number of employees
    const avgSalary = 5000;
    const totalSalary = totalEmployees * avgSalary;
    const totalBonus = totalSalary * 0.15;
    const totalSickDays = totalEmployees * 3;
    const avgSickDays = totalEmployees > 0 ? totalSickDays / totalEmployees : 0;
    const totalCompensation = totalSalary + totalBonus;
    const totalCommission = totalSalary * 0.08;
    
    return [
      {
        title: "Total Salary",
        value: `$${(totalSalary).toLocaleString()}`,
        icon: DollarSign,
        trend: "+5.2%",
        color: "bg-blue-100 text-blue-600"
      },
      {
        title: "Total Bonus",
        value: `$${(totalBonus).toLocaleString()}`,
        icon: Award,
        trend: "+2.1%",
        color: "bg-green-100 text-green-600"
      },
      {
        title: "Total Sick Days",
        value: totalSickDays.toString(),
        icon: Calendar,
        trend: "-1.5%",
        color: "bg-amber-100 text-amber-600"
      },
      {
        title: "Avg. Sick Days",
        value: avgSickDays.toFixed(1),
        icon: Calendar,
        trend: "-0.8%",
        color: "bg-purple-100 text-purple-600"
      },
      {
        title: "Total Employees",
        value: totalEmployees.toString(),
        icon: Users,
        trend: "+3.2%",
        color: "bg-sky-100 text-sky-600"
      },
      {
        title: "Total Compensation",
        value: `$${(totalCompensation).toLocaleString()}`,
        icon: DollarSign,
        trend: "+4.7%",
        color: "bg-indigo-100 text-indigo-600"
      },
      {
        title: "Total Commission",
        value: `$${(totalCommission).toLocaleString()}`,
        icon: Percent,
        trend: "+6.3%",
        color: "bg-rose-100 text-rose-600"
      },
      {
        title: "Avg. Base Salary",
        value: `$${(avgSalary).toLocaleString()}`,
        icon: TrendingUp,
        trend: "+2.5%",
        color: "bg-emerald-100 text-emerald-600"
      }
    ];
  }, [employees]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600">{metric.trend}</span>
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

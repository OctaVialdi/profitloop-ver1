
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Employee } from "@/hooks/useEmployees";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Users } from "lucide-react";
import { 
  generateDepartmentData, 
  generateLocationData,
  generateCompensationByDepartment,
  generateCompensationByLocation,
  generateEmployeeGrowth,
  generateGenderDistribution
} from "@/utils/hrDashboardUtils";

interface HRDashboardChartsProps {
  employees: Employee[];
}

export function HRDashboardCharts({ employees }: HRDashboardChartsProps) {
  // Generate data for the charts
  const departmentData = useMemo(() => generateDepartmentData(), []);
  const locationData = useMemo(() => generateLocationData(), []);
  const compensationByDepartment = useMemo(() => generateCompensationByDepartment(), []);
  const compensationByLocation = useMemo(() => generateCompensationByLocation(), []);
  const employeeGrowth = useMemo(() => generateEmployeeGrowth(), []);
  const genderDistribution = useMemo(() => generateGenderDistribution(), []);
  
  // Define color theme for all charts
  const COLORS = useMemo(() => ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'], []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Compensation by Location */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Compensation by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[180px]" config={{
            value: { theme: { light: "#3b82f6", dark: "#3b82f6" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compensationByLocation} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Total Employees Growth */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Employee Growth</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[180px]" config={{
            employees: { theme: { light: "#10b981", dark: "#10b981" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeGrowth} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="employees" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Employees by Department */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Employees by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center">
          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Compensation by Department */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Compensation by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[180px]" config={{
            salary: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
            bonus: { theme: { light: "#10b981", dark: "#10b981" } },
            commission: { theme: { light: "#f59e0b", dark: "#f59e0b" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compensationByDepartment} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="salary" stackId="a" fill="#3b82f6" />
                <Bar dataKey="bonus" stackId="a" fill="#10b981" />
                <Bar dataKey="commission" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-center">
          <div className="flex items-center justify-center h-[180px]">
            <div className="flex items-center gap-4">
              <div>
                <div className="mb-1 text-center">
                  <span className="text-lg font-bold text-blue-500">{genderDistribution.male}%</span>
                  <p className="text-xs text-muted-foreground">Male</p>
                </div>
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`male-${i}`} className={`h-4 w-4 ${i < Math.floor(genderDistribution.male / 10) ? 'text-blue-500' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
              </div>
              <div className="mx-2 text-gray-300 dark:text-gray-600 font-light">vs</div>
              <div>
                <div className="mb-1 text-center">
                  <span className="text-lg font-bold text-pink-500">{genderDistribution.female}%</span>
                  <p className="text-xs text-muted-foreground">Female</p>
                </div>
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`female-${i}`} className={`h-4 w-4 ${i < Math.floor(genderDistribution.female / 10) ? 'text-pink-500' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees by Location */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0 pt-3">
          <CardTitle className="text-sm font-medium">Employees by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center">
          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

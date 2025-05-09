
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
    <div className="grid gap-6 md:grid-cols-2">
      {/* Compensation by Location - Modern Card Style */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Compensation by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 relative">
          <ChartContainer className="h-[250px]" config={{
            b: { label: "Base", theme: { light: "#3b82f6", dark: "#3b82f6" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compensationByLocation}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Total Employees Growth - Modern Card Style */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Employee Growth</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 relative">
          <ChartContainer className="h-[250px]" config={{
            employees: { label: "Employees", theme: { light: "#10b981", dark: "#10b981" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeGrowth}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="employees" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Employees by Department - Modern Pie Chart */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Employees by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center relative">
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Compensation by Department - Modern Stacked Bar */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Compensation by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 relative">
          <ChartContainer className="h-[250px]" config={{
            salary: { label: "Salary", theme: { light: "#3b82f6", dark: "#3b82f6" } },
            bonus: { label: "Bonus", theme: { light: "#10b981", dark: "#10b981" } },
            commission: { label: "Commission", theme: { light: "#f59e0b", dark: "#f59e0b" } }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compensationByDepartment}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="salary" stackId="a" fill="#3b82f6" />
                <Bar dataKey="bonus" stackId="a" fill="#10b981" />
                <Bar dataKey="commission" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gender Distribution - Modern Visual */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-center relative">
          <div className="flex flex-col items-center justify-center h-[250px]">
            <div className="flex items-end">
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`male-${i}`} className={`h-5 w-5 ${i < Math.floor(genderDistribution.male / 10) ? 'text-blue-500' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
                <p className="mt-2 text-lg font-bold text-blue-500">{genderDistribution.male}%</p>
                <p>Male</p>
              </div>
              <div className="mx-6 text-gray-300 dark:text-gray-600">vs</div>
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`female-${i}`} className={`h-5 w-5 ${i < Math.floor(genderDistribution.female / 10) ? 'text-pink-500' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
                <p className="mt-2 text-lg font-bold text-pink-500">{genderDistribution.female}%</p>
                <p>Female</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees by Location - Modern Pie Chart */}
      <Card className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="pb-0 relative">
          <CardTitle className="text-base font-semibold">Employees by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center relative">
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

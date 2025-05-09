
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Employee } from "@/hooks/useEmployees";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface HRDashboardChartsProps {
  employees: Employee[];
}

export function HRDashboardCharts({ employees }: HRDashboardChartsProps) {
  // Generate mock data for the charts
  const departmentData = useMemo(() => {
    return [
      { name: "Engineering", value: 35, color: "#3b82f6" },
      { name: "Marketing", value: 25, color: "#10b981" },
      { name: "Sales", value: 20, color: "#f59e0b" },
      { name: "HR", value: 10, color: "#8b5cf6" },
      { name: "Finance", value: 10, color: "#ec4899" }
    ];
  }, []);

  const locationData = useMemo(() => {
    return [
      { name: "Jakarta", value: 40, color: "#3b82f6" },
      { name: "Bandung", value: 25, color: "#10b981" },
      { name: "Surabaya", value: 20, color: "#f59e0b" },
      { name: "Medan", value: 15, color: "#8b5cf6" }
    ];
  }, []);

  const compensationByDepartment = useMemo(() => {
    return [
      {
        name: "Engineering",
        salary: 500000,
        bonus: 75000,
        commission: 40000
      },
      {
        name: "Marketing",
        salary: 350000,
        bonus: 52500,
        commission: 28000
      },
      {
        name: "Sales",
        salary: 400000,
        bonus: 60000,
        commission: 80000
      },
      {
        name: "HR",
        salary: 280000,
        bonus: 42000,
        commission: 22400
      },
      {
        name: "Finance",
        salary: 420000,
        bonus: 63000,
        commission: 33600
      }
    ];
  }, []);

  const compensationByLocation = useMemo(() => {
    return [
      { name: "Jakarta", value: 550000 },
      { name: "Bandung", value: 420000 },
      { name: "Surabaya", value: 480000 },
      { name: "Medan", value: 380000 }
    ];
  }, []);

  const employeeGrowth = useMemo(() => {
    return [
      { name: "Jan", employees: 45 },
      { name: "Feb", employees: 48 },
      { name: "Mar", employees: 52 },
      { name: "Apr", employees: 55 },
      { name: "May", employees: 58 },
      { name: "Jun", employees: 62 },
    ];
  }, []);

  const genderDistribution = useMemo(() => {
    return {
      male: 58,
      female: 42
    };
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Compensation by Location */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Compensation Distribution by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[250px]" config={{
            b: { label: "Base", theme: { light: "#3b82f6" } }
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
      
      {/* Total Employees Growth */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Total Employees</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[250px]" config={{
            employees: { label: "Employees", theme: { light: "#10b981" } }
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

      {/* Employees by Department */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Employees by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center">
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

      {/* Compensation by Department */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Compensation Distribution by Department</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer className="h-[250px]" config={{
            salary: { label: "Salary", theme: { light: "#3b82f6" } },
            bonus: { label: "Bonus", theme: { light: "#10b981" } },
            commission: { label: "Commission", theme: { light: "#f59e0b" } }
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

      {/* Gender Distribution */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Employees by Gender</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-center">
          <div className="flex flex-col items-center justify-center h-[250px]">
            <div className="flex items-end">
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`male-${i}`} className={`h-5 w-5 ${i < Math.floor(genderDistribution.male / 10) ? 'text-blue-500' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="mt-2 text-lg font-bold text-blue-500">{genderDistribution.male}%</p>
                <p>Male</p>
              </div>
              <div className="mx-6 text-gray-300">vs</div>
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Users key={`female-${i}`} className={`h-5 w-5 ${i < Math.floor(genderDistribution.female / 10) ? 'text-pink-500' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="mt-2 text-lg font-bold text-pink-500">{genderDistribution.female}%</p>
                <p>Female</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees by Location */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Employees by Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center">
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

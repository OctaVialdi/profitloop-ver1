
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowDown, ChartPie, Table as TableIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Expenses() {
  // Sample data for the charts and tables
  const expenseBreakdownData = [
    { name: "Equipment", value: 68.7, color: "#94A3B8" },
    { name: "Office Supplies", value: 11.1, color: "#64748B" },
    { name: "Advertising", value: 22.2, color: "#475569" },
  ];

  const monthlyComparisonData = [
    { name: "Apr", value: 18 },
  ];

  const recurringExpenses = [
    {
      title: "Office Rent",
      amount: "Rp 15.000.000",
      category: "Rent",
      date: "15 May 2025",
      frequency: "Monthly",
      isPaid: true
    },
    {
      title: "Software Licenses",
      amount: "Rp 5.000.000",
      category: "Software",
      date: "01 Jun 2025",
      frequency: "Quarterly",
      isPaid: true
    },
    {
      title: "Insurance",
      amount: "Rp 35.000.000",
      category: "Insurance",
      date: "10 Jul 2025",
      frequency: "Yearly",
      isPaid: true
    },
    {
      title: "Internet Service",
      amount: "Rp 2.500.000",
      category: "Utilities",
      date: "30 May 2025",
      frequency: "Monthly",
      isPaid: true
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Manage and track your organization's expenses
        </p>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex overflow-auto pb-2">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted h-11">
            <TabsTrigger 
              value="overview" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="add-expense" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Add Expense
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Budget
            </TabsTrigger>
            <TabsTrigger 
              value="payroll" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Payroll
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="approvals" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Approvals
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Month Total */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Month Total</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Rp 0</h3>
                <span className="flex items-center text-xs text-red-500">
                  <ArrowDown className="h-3 w-3 mr-1" /> 100.0%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs. Rp 22.500.000 last month</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses YTD */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Expenses YTD</p>
                <span className="bg-blue-50 text-blue-600 text-xs py-1 px-1.5 rounded">$</span>
              </div>
              <h3 className="text-2xl font-bold">Rp 22.500.000</h3>
              <p className="text-xs text-muted-foreground">3 transactions</p>
            </div>
          </CardContent>
        </Card>

        {/* Highest Expense */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Highest Expense</p>
              <h3 className="text-2xl font-bold">Rp 15.000.000</h3>
              <p className="text-xs">New laptops for IT team</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="inline-block w-3 h-3 rounded-full border mr-1"></span> 10 Apr 2025
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Latest Transaction */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Latest Transaction</p>
              <h3 className="text-lg font-bold">Monthly office supplies restock</h3>
              <h4 className="text-xl font-bold">Rp 2.500.000</h4>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="inline-block w-3 h-3 rounded-full border mr-1"></span> 15 Apr 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Expenses */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recurring Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recurringExpenses.map((expense, index) => (
            <Card key={index} className="overflow-hidden border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{expense.title}</p>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {expense.frequency}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{expense.amount}</h3>
                  <p className="text-xs text-muted-foreground">{expense.category}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full border mr-1"></span> {expense.date}
                  </p>
                  <div className={`flex items-center justify-center py-2 ${expense.isPaid ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'} rounded`}>
                    {expense.isPaid ? '✓ Mark Paid' : 'Mark Paid'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Total Expenses Summary */}
      <div className="bg-blue-600 text-white p-6 rounded-lg">
        <div className="space-y-2">
          <p className="text-lg font-medium">Total Expenses</p>
          <p className="text-sm opacity-80">3 total transactions</p>
          <h2 className="text-3xl font-bold">Rp 22.500.000</h2>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Expense Breakdown</h3>
                <div className="flex border rounded-md overflow-hidden">
                  <span className="px-4 py-1 border-r bg-white">Category</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <span className="sr-only">Open menu</span>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex border rounded">
                <Button variant="ghost" className="flex-1 rounded-none flex items-center justify-center gap-2 h-10 border-r">
                  <ChartPie className="h-4 w-4" /> Chart
                </Button>
                <Button variant="ghost" className="flex-1 rounded-none flex items-center justify-center gap-2 h-10 bg-gray-100">
                  <TableIcon className="h-4 w-4" /> Table
                </Button>
              </div>
              <div className="h-72">
                <ChartContainer 
                  config={Object.fromEntries(expenseBreakdownData.map(item => [
                    item.name, { color: item.color }
                  ]))}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap justify-around mt-2">
                  {expenseBreakdownData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                      <span>{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Month-over-Month Comparison */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Month-over-Month Comparison</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparisonData} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false}
                      ticks={[0, 6, 12, 18, 24]}
                      tickFormatter={(value) => `${value} k`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#64748B" 
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center mt-4 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                    <span>Expenses</span>
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

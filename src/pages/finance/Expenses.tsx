import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { ArrowDown, ChartPie, Table as TableIcon, ChevronDown, Calendar, Users, Filter } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Expenses() {
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // State to track the active view for expense breakdown
  const [expenseView, setExpenseView] = useState<"chart" | "table">("chart");
  
  // Sample data for the charts and tables
  const expenseBreakdownData = [
    { name: "Equipment", value: 66.7, color: "#FFBA2C", amount: "Rp 15.000.000" },
    { name: "Office Supplies", value: 11.1, color: "#42B96A", amount: "Rp 2.500.000" },
    { name: "Advertising", value: 22.2, color: "#4192F7", amount: "Rp 5.000.000" },
  ];

  // Updated monthly comparison data with more months
  const monthlyComparisonData = [
    { name: "Jan", expense: 10, income: 15 },
    { name: "Feb", expense: 12, income: 14 },
    { name: "Mar", expense: 16, income: 18 },
    { name: "Apr", expense: 18, income: 22 },
    { name: "May", expense: 14, income: 19 },
    { name: "Jun", expense: 20, income: 23 },
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

  // Sample data for expenses table
  const expenseTransactions = [
    {
      date: "15 Apr 2025",
      description: "Monthly office supplies restock",
      category: "Office Supplies",
      amount: "Rp 2.500.000",
      department: "General",
      type: "Operational",
      status: "operational"
    },
    {
      date: "10 Apr 2025",
      description: "New laptops for IT team",
      category: "Equipment",
      amount: "Rp 15.000.000",
      department: "IT",
      type: "Fixed",
      status: "fixed"
    },
    {
      date: "05 Apr 2025",
      description: "Social media campaign",
      category: "Advertising",
      amount: "Rp 5.000.000",
      department: "Marketing",
      type: "Variable",
      status: "variable"
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "budget") {
      navigate("/finance/expenses/budget");
    }
  };

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
        <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
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

      {/* Expenses Table */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border shadow-sm">
          {/* Filters */}
          <div className="p-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Select>
                <SelectTrigger className="w-full bg-white border rounded-md">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="All Time" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger className="w-full bg-white border rounded-md">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="All Departments" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger className="w-full bg-white border rounded-md">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-600 font-medium">Date <ArrowDown className="inline h-4 w-4" /></TableHead>
                  <TableHead className="text-gray-600 font-medium">Description</TableHead>
                  <TableHead className="text-gray-600 font-medium">Category</TableHead>
                  <TableHead className="text-gray-600 font-medium text-right">Amount</TableHead>
                  <TableHead className="text-gray-600 font-medium">Department</TableHead>
                  <TableHead className="text-gray-600 font-medium">Type</TableHead>
                  <TableHead className="text-gray-600 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseTransactions.map((expense, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell className="font-medium">{expense.date}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className={`text-right ${expense.category === "Equipment" ? "text-red-500" : ""}`}>
                      {expense.amount}
                    </TableCell>
                    <TableCell>{expense.department}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-md text-sm ${
                        expense.status === "operational" ? "bg-green-50 text-green-600" :
                        expense.status === "fixed" ? "bg-blue-50 text-blue-600" :
                        "bg-amber-50 text-amber-600"
                      }`}>
                        {expense.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown - Updated with Table View option */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Expense Breakdown</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-4 py-2 border rounded-md flex items-center gap-2">
                    <span>Category</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Categories</DropdownMenuItem>
                  <DropdownMenuItem>Equipment</DropdownMenuItem>
                  <DropdownMenuItem>Office Supplies</DropdownMenuItem>
                  <DropdownMenuItem>Advertising</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-2 bg-gray-50 rounded-md overflow-hidden">
              <Button 
                variant="ghost" 
                className={`flex-1 rounded-none flex items-center justify-center gap-2 h-12 ${expenseView === 'chart' ? 'bg-white' : ''}`}
                onClick={() => setExpenseView('chart')}
              >
                <ChartPie className="h-5 w-5" /> Chart
              </Button>
              <Button 
                variant="ghost" 
                className={`flex-1 rounded-none flex items-center justify-center gap-2 h-12 ${expenseView === 'table' ? 'bg-white' : ''}`}
                onClick={() => setExpenseView('table')}
              >
                <TableIcon className="h-5 w-5" /> Table
              </Button>
            </div>
            
            {expenseView === 'chart' ? (
              <div className="h-[400px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Category Labels With Percentages */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Equipment Label (Left) */}
                  <div className="absolute left-6 text-xl font-semibold" style={{ color: "#FFBA2C" }}>
                    Equipment: {expenseBreakdownData[0].value}%
                  </div>
                  
                  {/* Office Supplies Label (Right Top) */}
                  <div className="absolute right-6 top-1/3 text-xl font-semibold" style={{ color: "#42B96A" }}>
                    Office Supplies: {expenseBreakdownData[1].value}%
                  </div>
                  
                  {/* Advertising Label (Right Bottom) */}
                  <div className="absolute right-6 bottom-1/3 text-xl font-semibold" style={{ color: "#4192F7" }}>
                    Advertising: {expenseBreakdownData[2].value}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                <div className="grid grid-cols-3 border-b pb-4">
                  <div className="text-lg font-bold">Category</div>
                  <div className="text-lg font-bold text-right">Amount</div>
                  <div className="text-lg font-bold text-right">%</div>
                </div>
                
                {expenseBreakdownData.map((category, index) => (
                  <div key={index} className="grid grid-cols-3 py-5 border-b">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></span>
                      <span className="text-lg">{category.name}</span>
                    </div>
                    <div className="text-lg text-right">{category.amount}</div>
                    <div className="text-lg text-right">{category.value}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Month-over-Month Comparison - UPDATED UI */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Month-over-Month Comparison</h3>
                <Select defaultValue="6months">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickFormatter={(value) => `${value}k`}
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.5rem", 
                        padding: "0.5rem" 
                      }}
                      formatter={(value) => [`${value}k`, ""]}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      align="right"
                      iconSize={10}
                      iconType="circle"
                    />
                    <Bar 
                      name="Income" 
                      dataKey="income" 
                      fill="#4192F7" 
                      radius={[4, 4, 0, 0]} 
                      barSize={16}
                    />
                    <Bar 
                      name="Expenses" 
                      dataKey="expense" 
                      fill="#FFBA2C" 
                      radius={[4, 4, 0, 0]} 
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4192F7]"></div>
                  <span className="text-sm">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFBA2C]"></div>
                  <span className="text-sm">Expenses</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

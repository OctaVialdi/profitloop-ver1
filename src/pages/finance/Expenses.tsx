
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ChartPie, Table as TableIcon, ChevronDown, Calendar, Users, Filter, Search, Download, Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddExpenseDialog from "./components/AddExpenseDialog";

export default function Expenses() {
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // State to track the active view for expense breakdown and active tab
  const [expenseView, setExpenseView] = useState<"chart" | "table">("chart");
  const [activeTab, setActiveTab] = useState<"overview" | "budget" | "compliance" | "approvals">("overview");
  
  // Sample data for the charts and tables
  const expenseBreakdownData = [
    { name: "Equipment", value: 66.7, color: "#4C6FFF", amount: "Rp 15.000.000" },
    { name: "Office Supplies", value: 11.1, color: "#50D1B2", amount: "Rp 2.500.000" },
    { name: "Advertising", value: 22.2, color: "#FFB547", amount: "Rp 5.000.000" },
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

  // Budget data from ExpenseBudget.tsx
  const budgetCategories = [
    {
      name: "Marketing",
      current: 5000000,
      total: 50000000,
      usedPercentage: 10,
      status: "safe"
    },
    {
      name: "IT",
      current: 15000000,
      total: 30000000,
      usedPercentage: 50,
      status: "warning"
    },
    {
      name: "Operations",
      current: 0,
      total: 25000000,
      usedPercentage: 0,
      status: "safe"
    },
    {
      name: "HR",
      current: 0,
      total: 15000000,
      usedPercentage: 0,
      status: "safe"
    }
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "overview" | "budget" | "compliance" | "approvals");
  };

  // Handle budget view selection
  const handleBudgetViewChange = (value: string) => {
    switch (value) {
      case "current":
        // Already on current budget page
        break;
      case "forecast":
        navigate("/finance/expenses/budget/forecast");
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Expenses</h2>
          <p className="text-muted-foreground">
            Manage and track your organization's expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <AddExpenseDialog />
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <Tabs defaultValue="overview" value={activeTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="bg-card rounded-xl p-1 border overflow-auto">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Budget
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Compliance
          </TabsTrigger>
          <TabsTrigger 
            value="approvals" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Approvals
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Month Total */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Current Month Total</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Rp 0</h3>
                    <span className="flex items-center text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                      <ArrowDown className="h-3 w-3 mr-1" /> 100.0%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">vs. Rp 22.500.000 last month</p>
                </div>
              </CardContent>
            </Card>

            {/* Total Expenses YTD */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Expenses YTD</p>
                  <span className="bg-blue-100 text-blue-600 text-xs py-1 px-2 rounded-full">$</span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">Rp 22.500.000</h3>
                <p className="text-xs text-muted-foreground mt-1">3 transactions</p>
              </CardContent>
            </Card>

            {/* Highest Expense */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Highest Expense</p>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">Rp 15.000.000</h3>
                <p className="text-xs mt-1">New laptops for IT team</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-1"></span> 10 Apr 2025
                </p>
              </CardContent>
            </Card>

            {/* Latest Transaction */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Latest Transaction</p>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium">Monthly office supplies restock</h3>
                <h4 className="text-xl font-bold mt-1">Rp 2.500.000</h4>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> 15 Apr 2025
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total Expenses Summary */}
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-medium">Total Expenses</p>
                  <p className="text-sm opacity-80">3 total transactions</p>
                </div>
                <h2 className="text-3xl font-bold">Rp 22.500.000</h2>
              </div>
            </CardContent>
          </Card>

          {/* Recurring Expenses */}
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Recurring Expenses</h3>
              <Button variant="outline" size="sm" className="text-blue-600">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recurringExpenses.map((expense, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{expense.title}</p>
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {expense.frequency}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{expense.amount}</h3>
                      <p className="text-xs text-muted-foreground">{expense.category}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-1"></span> {expense.date}
                      </p>
                      <Button 
                        variant={expense.isPaid ? "secondary" : "outline"} 
                        className={`w-full ${expense.isPaid ? 'bg-green-50 text-green-600 hover:bg-green-100' : ''}`}
                        size="sm"
                      >
                        {expense.isPaid ? '✓ Mark Paid' : 'Mark Paid'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Expenses Table */}
          <Card className="overflow-hidden shadow-md border mt-6">
            <CardHeader className="bg-gray-50 border-b p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10" placeholder="Search expenses..." />
                </div>
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Select>
                    <SelectTrigger className="w-[140px] bg-white">
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
                  
                  <Select>
                    <SelectTrigger className="w-[160px] bg-white">
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
                  
                  <Select>
                    <SelectTrigger className="w-[140px] bg-white">
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
            </CardHeader>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-600 font-medium">Date <ArrowDown className="inline h-3 w-3" /></TableHead>
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
                    <TableRow key={index} className="border-b hover:bg-gray-50">
                      <TableCell className="font-medium">{expense.date}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className={`text-right ${expense.category === "Equipment" ? "text-red-500 font-medium" : ""}`}>
                        {expense.amount}
                      </TableCell>
                      <TableCell>{expense.department}</TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            
            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">Showing 3 of 3 expenses</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </Card>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Expense Breakdown - Updated with Table View option */}
            <Card className="overflow-hidden shadow-md">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Expense Breakdown</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="px-3 py-1.5 h-auto text-sm border rounded-lg flex items-center gap-2">
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
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-2 bg-gray-50 rounded-lg overflow-hidden mb-4">
                  <Button 
                    variant="ghost" 
                    className={`flex-1 rounded-none flex items-center justify-center gap-2 h-10 ${expenseView === 'chart' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setExpenseView('chart')}
                  >
                    <ChartPie className="h-4 w-4" /> Chart
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`flex-1 rounded-none flex items-center justify-center gap-2 h-10 ${expenseView === 'table' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setExpenseView('table')}
                  >
                    <TableIcon className="h-4 w-4" /> Table
                  </Button>
                </div>
                
                {expenseView === 'chart' ? (
                  <div className="h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={130}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-4">
                      {expenseBreakdownData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="grid grid-cols-3 pb-3 mb-2 border-b">
                      <div className="text-sm font-semibold text-gray-600">Category</div>
                      <div className="text-sm font-semibold text-gray-600 text-right">Amount</div>
                      <div className="text-sm font-semibold text-gray-600 text-right">%</div>
                    </div>
                    
                    {expenseBreakdownData.map((category, index) => (
                      <div key={index} className="grid grid-cols-3 py-3 border-b">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="text-sm text-right">{category.amount}</div>
                        <div className="text-sm text-right font-medium">{category.value}%</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Month-over-Month Comparison */}
            <Card className="overflow-hidden shadow-md">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Monthly Comparison</CardTitle>
                  <Select defaultValue="6months">
                    <SelectTrigger className="w-[160px]">
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
              </CardHeader>
              
              <CardContent className="p-6">
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
                          borderRadius: "8px", 
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          padding: "8px" 
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
                        fill="#4C6FFF" 
                        radius={[4, 4, 0, 0]} 
                        barSize={14}
                      />
                      <Bar 
                        name="Expenses" 
                        dataKey="expense" 
                        fill="#FFB547" 
                        radius={[4, 4, 0, 0]} 
                        barSize={14}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4C6FFF]"></div>
                    <span className="text-sm">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFB547]"></div>
                    <span className="text-sm">Expenses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Budget Tab Content */}
        <TabsContent value="budget" className="mt-6 space-y-6">
          {/* Budget View Selector Dropdown */}
          <div className="mb-6">
            <Select defaultValue="current" onValueChange={handleBudgetViewChange}>
              <SelectTrigger className="w-[240px] bg-white">
                <SelectValue placeholder="Select Budget View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Budget</SelectItem>
                <SelectItem value="forecast">Budget Forecast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Tracking Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Budget Tracking</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Over Budget</span>
              </div>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetCategories.map((category, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm">
                      Rp{category.current.toLocaleString()} / Rp{category.total.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={category.usedPercentage}
                  className={`h-2 ${
                    category.status === "safe" 
                      ? "bg-gray-200" 
                      : category.status === "warning" 
                      ? "bg-yellow-200" 
                      : "bg-red-200"
                  }`}
                >
                  <div
                    className={`h-full ${
                      category.status === "safe" 
                        ? "bg-green-500" 
                        : category.status === "warning" 
                        ? "bg-yellow-500" 
                        : "bg-red-500"
                    }`}
                    style={{ width: `${category.usedPercentage}%` }}
                  ></div>
                </Progress>
                <div className="flex justify-end mt-2">
                  <span className="text-sm">{category.usedPercentage}% used</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Compliance Tab Content */}
        <TabsContent value="compliance" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Compliance functionality will be available soon.</p>
          </div>
        </TabsContent>
        
        {/* Approvals Tab Content */}
        <TabsContent value="approvals" className="mt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Approvals functionality will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

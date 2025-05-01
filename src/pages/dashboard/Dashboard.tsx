
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  LineChart as RechartLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartPie,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the metrics
  const metrics = [
    {
      title: "Total Projects",
      value: 12,
      change: 2.5,
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Active Tasks",
      value: 45,
      change: -3.2,
      trend: "down",
      icon: LineChart,
    },
    {
      title: "Team Members",
      value: 8,
      change: 1,
      trend: "up",
      icon: Users,
    },
    {
      title: "Completion Rate",
      value: "68%",
      change: 5.1,
      trend: "up",
      icon: PieChart,
    },
  ];

  // Sample data for the charts
  const lineChartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 900 },
  ];

  const barChartData = [
    { name: "Project A", value: 400 },
    { name: "Project B", value: 300 },
    { name: "Project C", value: 600 },
    { name: "Project D", value: 280 },
    { name: "Project E", value: 900 },
  ];

  const pieChartData = [
    { name: "Complete", value: 540 },
    { name: "In Progress", value: 320 },
    { name: "Not Started", value: 140 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button>Download Report</Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-xs ${
                        metric.trend === "up"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {Math.abs(metric.change)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      from previous month
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Monthly project progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ value: { theme: { light: '#2563eb', dark: '#3b82f6' } } }} className="aspect-[4/3]">
                  <RechartLine data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartLine>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ 
                  complete: { color: '#0088FE' }, 
                  inProgress: { color: '#00C49F' }, 
                  notStarted: { color: '#FFBB28' } 
                }} className="aspect-[4/3]">
                  <RechartPie>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </RechartPie>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed metrics and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p>Analytics content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated reports and statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p>Reports content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

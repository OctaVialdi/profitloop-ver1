
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert, Clock, Check, Star, BarChart, PieChart, Inbox, LayoutDashboard } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const weekdayData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 8 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 10 },
  { name: "Fri", value: 20 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 3 }
];

const issueTypeData = [
  { name: "Complaints", value: 45, color: "#ff6384" },
  { name: "Questions", value: 35, color: "#36a2eb" },
  { name: "Feature Requests", value: 20, color: "#4bc0c0" }
];

const ticketData = [
  { id: "TKT-1001", subject: "Unable to access account", status: "Open", priority: "High", assignee: "Sarah Kim", created: "2 days ago" },
  { id: "TKT-1002", subject: "Billing inquiry about recent charge", status: "Open", priority: "Medium", assignee: "John Doe", created: "1 day ago" },
  { id: "TKT-1003", subject: "Feature request: Dark mode", status: "In Progress", priority: "Low", assignee: "Alex Chen", created: "3 days ago" },
  { id: "TKT-1004", subject: "App crashes on startup", status: "Open", priority: "High", assignee: "Unassigned", created: "5 hours ago" },
  { id: "TKT-1005", subject: "Password reset not working", status: "Open", priority: "Medium", assignee: "Maya Patel", created: "1 day ago" },
];

export default function CustomerServicePage() {
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Service</h2>
        <p className="text-muted-foreground">
          Customer service operations for {organization?.name || "your organization"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Open Tickets</p>
                    <h1 className="text-4xl font-bold mt-2 mb-1">8</h1>
                    <p className="text-xs text-muted-foreground">Normal levels</p>
                  </div>
                  <CircleAlert className="h-5 w-5 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Avg. Response Time</p>
                    <h1 className="text-4xl font-bold mt-2 mb-1">2h 30m</h1>
                    <p className="text-xs text-muted-foreground">Target: under 2h</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">SLA Compliance</p>
                    <h1 className="text-4xl font-bold mt-2 mb-1">92%</h1>
                    <p className="text-xs text-muted-foreground">+2% from last week</p>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Customer Satisfaction</p>
                    <h1 className="text-4xl font-bold mt-2 mb-1">
                      4.2
                      <span className="text-lg text-muted-foreground">/5</span>
                    </h1>
                    <p className="text-xs text-muted-foreground">Based on recent surveys</p>
                  </div>
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Ticket Volume (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={weekdayData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Day
                                  </span>
                                  <span className="font-bold">
                                    {payload[0].payload.name}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Tickets
                                  </span>
                                  <span className="font-bold">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Issue Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={issueTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issueTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      formatter={(value, entry, index) => {
                        const item = issueTypeData[index];
                        return <span className="text-sm">{item.name}: {item.value}%</span>;
                      }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: payload[0].payload.color }}
                                  />
                                  <span className="text-sm font-medium">
                                    {payload[0].name}: {payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketData.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.status === 'Open' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.priority === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : ticket.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {ticket.priority}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.assignee}</TableCell>
                        <TableCell className="text-right">{ticket.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

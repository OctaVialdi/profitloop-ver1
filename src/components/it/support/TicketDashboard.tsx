
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, FileDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "./types";
import { getPriorityBadgeClass, getStatusBadgeClass } from "./ticketUtils";

interface TicketDashboardProps {
  tickets: Ticket[];
  dashboardMetrics: {
    openTickets: number;
    avgResponseTime: number;
    slaComplianceRate: number;
    resolutionRate: number;
  };
}

export default function TicketDashboard({ tickets, dashboardMetrics }: TicketDashboardProps) {
  // Prepare chart data
  const responseTimeByCategory = [
    { name: "Software", value: 32 },
    { name: "Network", value: 9 },
    { name: "Hardware", value: 15 }
  ];
  
  const resolutionByDepartment = [
    { name: "Finance", value: 20 },
    { name: "HR", value: 15 }
  ];
  
  const slaComplianceOverTime = [
    { name: "3/24", value: 75 },
    { name: "4/24", value: 100 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">IT Support Overview</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={14} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileDown size={14} />
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Open Tickets Card */}
          <Card>
            <CardContent className="p-4">
              <div className="font-medium text-sm text-gray-500">Open Tickets</div>
              <div className="flex items-end justify-between mt-1">
                <div className="text-3xl font-semibold">{dashboardMetrics.openTickets}</div>
                <div className="flex items-center text-red-500 text-sm">
                  <ArrowDown size={14} className="mr-1" />
                  <span>60%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Response Time Card */}
          <Card>
            <CardContent className="p-4">
              <div className="font-medium text-sm text-gray-500">Avg. Response Time</div>
              <div className="flex items-end justify-between mt-1">
                <div className="text-3xl font-semibold">{dashboardMetrics.avgResponseTime}m</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Compliance Card */}
          <Card>
            <CardContent className="p-4">
              <div className="font-medium text-sm text-gray-500">SLA Compliance</div>
              <div className="flex items-end justify-between mt-1">
                <div className="text-3xl font-semibold">{dashboardMetrics.slaComplianceRate}%</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Rate Card */}
          <Card>
            <CardContent className="p-4">
              <div className="font-medium text-sm text-gray-500">Resolution Rate</div>
              <div className="flex items-end justify-between mt-1">
                <div className="text-3xl font-semibold">{dashboardMetrics.resolutionRate}%</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUp size={14} className="mr-1" />
                  <span>5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response Time by Category */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2">
              <div className="font-medium text-sm text-gray-500">Response Time by Category</div>
              <div className="text-2xl font-semibold">22m</div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={responseTimeByCategory}
                  margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 36]} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9b87f5" barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Time by Department */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2">
              <div className="font-medium text-sm text-gray-500">Resolution Time by Department</div>
              <div className="text-2xl font-semibold">18m</div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resolutionByDepartment}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9b87f5" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* SLA Compliance Over Time */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2">
              <div className="font-medium text-sm text-gray-500">SLA Compliance Over Time</div>
              <div className="text-2xl font-semibold">80%</div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={slaComplianceOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#9b87f5" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: "#9b87f5" }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets Overview */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Tickets</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.slice(0, 5).map(ticket => (
                  <TableRow key={`recent-${ticket.id}`}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityBadgeClass(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignee}</TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

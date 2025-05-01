
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CircleAlert, Clock, Check, Star, BarChart, 
  PieChart, Inbox, LayoutDashboard, Search, 
  Calendar, Edit, X, Circle, Star as StarIcon
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

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
  { 
    id: "TK-724",
    customer: "Customer 1",
    company: "Stark Industries",
    issue: "What are your business hours?",
    issueType: "Question",
    priority: "Low",
    assignee: "Unassigned",
    created: "5/2/2025 01:23 AM",
    status: "New",
    comments: 3
  },
  { 
    id: "TK-839",
    customer: "Customer 2",
    company: "Stark Industries",
    issue: "What are your business hours?",
    issueType: "Question",
    priority: "High",
    assignee: "Jane Smith",
    created: "5/2/2025 01:23 AM",
    status: "Open",
    comments: 0
  },
  { 
    id: "TK-182",
    customer: "Customer 3",
    company: "Acme Corp",
    issue: "How do I reset my password?",
    issueType: "Question",
    priority: "Low",
    assignee: "Unassigned",
    created: "5/1/2025 01:23 AM",
    status: "New",
    comments: 0
  },
  { 
    id: "TK-337",
    customer: "Customer 4",
    company: "Globex",
    issue: "Please add dark mode to the app",
    issueType: "Feature Request",
    priority: "Medium",
    assignee: "Alex Johnson",
    created: "5/2/2025 01:23 AM",
    status: "Closed",
    comments: 2,
    starred: true
  },
  { 
    id: "TK-505",
    customer: "Customer 5",
    company: "Wayne Enterprises",
    issue: "Where can I find my invoice?",
    issueType: "Question",
    priority: "Low",
    assignee: "John Doe",
    created: "4/30/2025 01:23 AM",
    status: "In Progress",
    comments: 2
  },
  { 
    id: "TK-177",
    customer: "Customer 6",
    company: "Initech",
    issue: "How do I reset my password?",
    issueType: "Question",
    priority: "Low",
    assignee: "John Doe",
    created: "4/28/2025 01:23 AM",
    status: "Closed",
    comments: 3
  },
  { 
    id: "TK-525",
    customer: "Customer 7",
    company: "Wayne Enterprises",
    issue: "Where can I find my invoice?",
    issueType: "Question",
    priority: "Medium",
    assignee: "Maria Garcia",
    created: "5/2/2025 01:23 AM",
    status: "Closed",
    comments: 0
  },
  { 
    id: "TK-513",
    customer: "Customer 8",
    company: "Globex",
    issue: "Can we have more payment options?",
    issueType: "Feature Request",
    priority: "Low",
    assignee: "John Doe",
    created: "5/2/2025 01:23 AM",
    status: "Resolved",
    comments: 0,
    starred: true
  }
];

export default function CustomerServicePage() {
  const { organization } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateType, setUpdateType] = useState("Progress Update");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFollowupDatePicker, setShowFollowupDatePicker] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Determine which tab is active based on the current route
  const isTicketsRoute = location.pathname.includes("/tickets");
  const activeTab = isTicketsRoute ? "tickets" : "dashboard";

  // Handle tab change
  const handleTabChange = (value) => {
    if (value === "tickets") {
      navigate("/operations/customer-service/tickets");
    } else {
      navigate("/operations/customer-service");
    }
  };

  // Open ticket details dialog
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Close ticket details dialog
  const closeTicketDetails = () => {
    setSelectedTicket(null);
    setIsEditMode(false);
    setShowFollowupDatePicker(false);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-purple-100 text-purple-800";
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Service</h2>
        <p className="text-muted-foreground">
          Customer service operations for {organization?.name || "your organization"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Tickets
          </TabsTrigger>
        </TabsList>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
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
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search tickets..."
                        className="pl-9 bg-white border rounded-md w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Button
                          variant="outline"
                          className="bg-white"
                          onClick={() => {
                            setSelectedFilterCategory("priority");
                            setSelectedFilter(null);
                          }}
                        >
                          All...
                        </Button>
                        {selectedFilterCategory === "priority" && (
                          <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                            <div className="p-1">
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center">
                                <Check className="h-4 w-4 mr-2" /> All Priorities
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                High
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Medium
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Low
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <Button
                          variant="outline"
                          className="bg-white"
                          onClick={() => {
                            setSelectedFilterCategory("status");
                            setSelectedFilter(null);
                          }}
                        >
                          All Statuses
                        </Button>
                        {selectedFilterCategory === "status" && (
                          <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                            <div className="p-1">
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center">
                                <Check className="h-4 w-4 mr-2" /> All Statuses
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                New
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Open
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                In Progress
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Resolved
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Closed
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <Button
                          variant="outline"
                          className="bg-white"
                          onClick={() => {
                            setSelectedFilterCategory("assignee");
                            setSelectedFilter(null);
                          }}
                        >
                          All Assignees
                        </Button>
                        {selectedFilterCategory === "assignee" && (
                          <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                            <div className="p-1">
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center">
                                <Check className="h-4 w-4 mr-2" /> All Assignees
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Unassigned
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Jane Smith
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Alex Johnson
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                John Doe
                              </button>
                              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                Maria Garcia
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Info</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ticketData.map((ticket) => (
                          <TableRow key={ticket.id} className="hover:bg-slate-100/70 cursor-pointer" onClick={() => openTicketDetails(ticket)}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>
                              <div>
                                {ticket.customer}
                                <div className="text-xs text-gray-500">{ticket.company}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                {ticket.issue}
                                <div className="text-xs text-gray-500">{ticket.issueType}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityStyle(ticket.priority)}`}>
                                {ticket.priority}
                              </div>
                            </TableCell>
                            <TableCell>{ticket.assignee}</TableCell>
                            <TableCell>{ticket.created}</TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                                {ticket.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              {ticket.comments > 0 && (
                                <div className="bg-gray-200 text-gray-700 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                                  <Circle className="h-3 w-3" /> {ticket.comments}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {ticket.starred ? (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500" onClick={(e) => e.stopPropagation()}>
                                  <StarIcon className="h-4 w-4 fill-yellow-400" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <StarIcon className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={closeTicketDetails}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>
                {selectedTicket.id} - {selectedTicket.company}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityStyle(selectedTicket.priority)}`}>
                  {selectedTicket.priority} Priority
                </div>
                <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </div>
              </div>
            </DialogHeader>
            
            {!isEditMode ? (
              <div>
                <div className="space-y-5 max-h-[60vh] overflow-y-auto p-1">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer Info</h3>
                    <p className="text-base font-medium">{selectedTicket.customer}</p>
                    <p className="text-sm text-blue-500">customer1@example.com</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="p-3 bg-slate-50 rounded-md text-base mt-1">{selectedTicket.issue}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                    <p className="text-base font-medium">{selectedTicket.assignee}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="text-base font-medium">{selectedTicket.created}</p>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-1" 
                      onClick={() => setShowFollowupDatePicker(true)}
                    >
                      <Calendar className="h-4 w-4" /> Schedule Follow-up
                    </Button>
                  </div>
                  
                  {selectedTicket.comments > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">Updates ({selectedTicket.comments})</h3>
                          <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditMode(true)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Add Update
                        </Button>
                      </div>
                      
                      {/* Sample updates */}
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-400 pl-4 py-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Jane Smith</p>
                            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-0.5 rounded-full">Escalation</span>
                          </div>
                          <p className="text-gray-600">Escalated to development team</p>
                          <p className="text-sm text-gray-400">5/1/2025 01:23 AM</p>
                        </div>
                        <div className="border-l-4 border-red-400 pl-4 py-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Alex Johnson</p>
                            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-0.5 rounded-full">Escalation</span>
                          </div>
                          <p className="text-gray-600">Escalated to development team</p>
                          <p className="text-sm text-gray-400">4/28/2025 02:23 AM</p>
                        </div>
                        <div className="border-l-4 border-red-400 pl-4 py-1">
                          <div className="flex justify-between">
                            <p className="font-medium">John Doe</p>
                            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-0.5 rounded-full">Escalation</span>
                          </div>
                          <p className="text-gray-600">Escalated to product manager</p>
                          <p className="text-sm text-gray-400">4/30/2025 03:23 AM</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 mt-4 border-t flex justify-between">
                  <Button onClick={() => setIsEditMode(true)}>Add Update</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={closeTicketDetails}>
                      Close
                    </Button>
                    <Button>Email</Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium">Add Update</h3>
                  <div>
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                      >
                        {updateType}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 opacity-50"
                        >
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </Button>
                      <div className="absolute z-10 hidden w-full min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-in p-1">
                        <div>
                          <div className="flex items-center gap-2 py-2 px-3 rounded bg-slate-100">
                            <Check className="h-4 w-4" /> Progress Update
                          </div>
                          <button className="flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-100 w-full text-left">
                            Escalation
                          </button>
                          <button className="flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-100 w-full text-left">
                            Resolution
                          </button>
                          <button className="flex items-center gap-2 py-2 px-3 rounded hover:bg-slate-100 w-full text-left">
                            Follow-up
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <textarea 
                      className="min-h-[120px] w-full resize-none rounded-md border p-3"
                      placeholder="Enter update details..."
                    ></textarea>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    Close
                  </Button>
                  <Button onClick={() => setIsEditMode(false)}>
                    Add Update
                  </Button>
                </DialogFooter>
              </>
            )}
            
            {showFollowupDatePicker && (
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 font-medium">Date</p>
                    <div className="relative">
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        Select date
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-medium">Time</p>
                    <Button variant="outline" className="w-full pl-3 text-left font-normal">
                      09:00
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto h-4 w-4 opacity-50"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
                <Button className="w-full mt-4">Schedule Follow-Up</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

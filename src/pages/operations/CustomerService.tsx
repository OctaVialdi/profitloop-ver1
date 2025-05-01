import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CircleAlert, Clock, Check, Star, BarChart, 
  PieChart, Inbox, LayoutDashboard, Search, 
  Calendar, Edit, X, Circle, Star as StarIcon,
  Square, SquareKanban
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";

// Keep the existing chart data definitions
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

// Modified ticket data to include unique IDs for drag-and-drop
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

const TICKET_STATUSES = ["New", "Open", "In Progress", "Resolved", "Closed"];

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
  const [tickets, setTickets] = useState(ticketData);

  // Determine which tab is active based on the current route
  const isTicketsRoute = location.pathname.includes("/tickets");
  const isKanbanRoute = location.pathname.includes("/kanban");
  let activeTab = "dashboard";
  
  if (isTicketsRoute) activeTab = "tickets";
  if (isKanbanRoute) activeTab = "kanban";

  // Handle tab change
  const handleTabChange = (value) => {
    if (value === "tickets") {
      navigate("/operations/customer-service/tickets");
    } else if (value === "kanban") {
      navigate("/operations/customer-service/kanban");
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

  // Handle drag and drop for kanban board
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Find the ticket that was dragged
    const ticketId = draggableId;
    
    // Update the ticket's status based on the destination column
    const newStatus = destination.droppableId;
    
    // Update tickets with new status
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
  };

  // Group tickets by status for the Kanban board
  const ticketsByStatus = TICKET_STATUSES.reduce((acc, status) => {
    acc[status] = tickets.filter(ticket => ticket.status === status);
    return acc;
  }, {});

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
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <SquareKanban className="h-4 w-4" />
            Kanban
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
                              {TICKET_STATUSES.map(status => (
                                <button key={status} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                                  {status}
                                </button>
                              ))}
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
                        {tickets.map((ticket) => (
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
        
        {activeTab === "kanban" && (
          <div className="space-y-4">
            <Card className="pb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Ticket Kanban Board</CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="flex gap-4 overflow-x-auto pb-6">
                    {TICKET_STATUSES.map(status => (
                      <div key={status} className="flex-shrink-0 w-72">
                        <div className="bg-gray-100 rounded-md p-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-sm">{status}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {ticketsByStatus[status].length}
                            </Badge>
                          </div>
                          <Droppable droppableId={status}>
                            {(provided) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex flex-col gap-2 min-h-[200px]"
                              >
                                {ticketsByStatus[status].map((ticket, index) => (
                                  <Draggable 
                                    key={ticket.id} 
                                    draggableId={ticket.id} 
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => openTicketDetails(ticket)}
                                      >
                                        <div className="flex items-start justify-between">
                                          <span className="font-medium text-sm">{ticket.id}</span>
                                          <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityStyle(ticket.priority)}`}>
                                            {ticket.priority}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{ticket.issue}</p>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-xs text-gray-500">{ticket.company}</span>
                                          {ticket.comments > 0 && (
                                            <div className="bg-gray-200 text-gray-700 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                                              <Circle className="h-2 w-2" /> {ticket.comments}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
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
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-2">
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                        value={selectedTicket.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setTickets(
                            tickets.map(t => 
                              t.id === selectedTicket.id ? {...t, status: newStatus} : t
                            )
                          );
                          setSelectedTicket({...selectedTicket, status: newStatus});
                        }}
                      >
                        {TICKET_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
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

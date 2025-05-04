
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus, RotateCw, Filter, FileDown, CheckCircle2, AlertCircle, FilePlus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import TicketDetailDialog from "@/components/it/TicketDetailDialog";
import TicketEditDialog from "@/components/it/TicketEditDialog";
import NewTicketDialog from "@/components/it/NewTicketDialog";
import FileUploadDialog from "@/components/it/FileUploadDialog";

// Type definition for ticket
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  department: string;
  category: {
    name: string;
    icon: string;
  };
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "Resolved" | "Pending" | "Received" | "Open" | "Maintenance" | "Retired" | "Rejected";
  createdAt: string;
  response: {
    time: string;
    type: "fast" | "medium" | "slow";
  };
  resolution: {
    time: string | null;
    type: "completed" | "pending" | null;
  };
  assignee: string;
}

export default function ITSupport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"userRequests" | "hardwareIssues">("userRequests");
  const [viewMode, setViewMode] = useState<"dashboard" | "table">("table");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [uploadingForTicket, setUploadingForTicket] = useState<string | undefined>(undefined);

  // Sample data for tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "T-001",
      title: "Software Installation",
      description: "Need to install Adobe Creative Suite on new marketing laptop.",
      department: "Marketing",
      category: { name: "Software", icon: "💻" },
      priority: "Medium",
      status: "In Progress",
      createdAt: "Mar 15, 08:30 AM",
      response: { time: "25m", type: "medium" },
      resolution: { time: null, type: null },
      assignee: "John Doe"
    },
    {
      id: "T-002",
      title: "Network Access Issue",
      description: "Can't connect to the finance shared drive after password reset.",
      department: "Finance",
      category: { name: "Network", icon: "🔌" },
      priority: "High",
      status: "Resolved",
      createdAt: "Mar 15, 09:15 AM",
      response: { time: "10m", type: "fast" },
      resolution: { time: "1h 20m", type: "completed" },
      assignee: "Sarah Wilson"
    },
    {
      id: "T-003",
      title: "Hardware Upgrade Request",
      description: "Need more RAM for development workstation to run virtual machines.",
      department: "Engineering",
      category: { name: "Hardware", icon: "🖥️" },
      priority: "High",
      status: "In Progress",
      createdAt: "Mar 16, 11:00 AM",
      response: { time: "15m", type: "fast" },
      resolution: { time: null, type: null },
      assignee: "John Doe"
    },
    {
      id: "T-004",
      title: "Email Configuration",
      description: "Need to set up email signature for new HR staff.",
      department: "HR",
      category: { name: "Software", icon: "💻" },
      priority: "Low",
      status: "Resolved",
      createdAt: "Mar 14, 02:30 PM",
      response: { time: "45m", type: "medium" },
      resolution: { time: "2h 15m", type: "completed" },
      assignee: "Sarah Wilson"
    },
    {
      id: "T-005",
      title: "Cisco Router RV340 Maintenance",
      description: "Scheduled firmware update and security patch installation.",
      department: "IT Infrastructure",
      category: { name: "Hardware", icon: "🖥️" },
      priority: "Medium",
      status: "In Progress",
      createdAt: "Apr 20, 09:30 AM",
      response: { time: "15m", type: "fast" },
      resolution: { time: null, type: null },
      assignee: "Michael Brown"
    },
  ]);

  // Function to get priority badge class
  const getPriorityBadgeClass = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: Ticket["status"]) => {
    switch (status) {
      case "In Progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "Open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Received":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Maintenance":
        return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100";
      case "Retired":
        return "bg-gray-100 text-gray-500 hover:bg-gray-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get response time class and icon
  const getResponseTimeClass = (type: Ticket["response"]["type"]) => {
    switch (type) {
      case "fast":
        return {
          icon: "🟢",
          className: "text-green-600",
        };
      case "medium":
        return {
          icon: "🟡",
          className: "text-amber-600",
        };
      case "slow":
        return {
          icon: "🔴",
          className: "text-red-600",
        };
    }
  };

  // Function to get resolution info
  const getResolutionInfo = (resolution: Ticket["resolution"]) => {
    if (resolution.time) {
      return {
        icon: resolution.type === "completed" ? "🟢" : "🟡",
        time: resolution.time,
        className: resolution.type === "completed" ? "text-green-600" : "text-amber-600",
      };
    }
    return {
      icon: "⚪",
      time: "Pending",
      className: "text-gray-500",
    };
  };

  // Function to handle viewing a ticket
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailDialog(true);
  };

  // Function to handle editing a ticket
  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditDialog(true);
  };

  // Function to handle deleting a ticket
  const handleDeleteTicket = (ticket: Ticket) => {
    // Show confirm dialog
    if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
      // Remove ticket from list
      setTickets(tickets.filter((t) => t.id !== ticket.id));
      
      // Show notification
      toast({
        title: "Ticket Deleted",
        description: `Ticket ${ticket.id} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  // Function to handle approving a ticket
  const handleApproveTicket = () => {
    if (!selectedTicket) return;
    
    // Update ticket status
    const updatedTicket: Ticket = { 
      ...selectedTicket, 
      status: "In Progress",
    };
    
    // Update tickets list
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    
    // Close dialog
    setShowDetailDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Approved",
      description: `Ticket ${selectedTicket.id} has been approved.`,
      variant: "default",
    });
  };

  // Function to handle rejecting a ticket
  const handleRejectTicket = () => {
    if (!selectedTicket) return;
    
    // Update ticket status
    const updatedTicket: Ticket = { 
      ...selectedTicket, 
      status: "Rejected", 
    };
    
    // Update tickets list
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    
    // Close dialog
    setShowDetailDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Rejected",
      description: `Ticket ${selectedTicket.id} has been rejected.`,
      variant: "destructive",
    });
  };

  // Function to handle closing a ticket
  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    
    // Update ticket status
    const updatedTicket: Ticket = { 
      ...selectedTicket, 
      status: "Retired",
    };
    
    // Update tickets list
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    
    // Close dialog
    setShowDetailDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Closed",
      description: `Ticket ${selectedTicket.id} has been closed.`,
      variant: "default",
    });
  };

  // Function to handle marking a ticket as resolved
  const handleMarkAsResolved = () => {
    if (!selectedTicket) return;
    
    // Update ticket status and resolution
    const updatedTicket: Ticket = { 
      ...selectedTicket, 
      status: "Resolved",
      resolution: { 
        time: "2h 30m", 
        type: "completed" 
      }
    };
    
    // Update tickets list
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    
    // Close dialog
    setShowDetailDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Resolved",
      description: `Ticket ${selectedTicket.id} has been marked as resolved.`,
      variant: "default",
    });
  };

  // Function to handle updating a ticket
  const handleUpdateTicket = (updatedTicket: Ticket) => {
    // Update tickets list
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    
    // Close dialog
    setShowEditDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Updated",
      description: `Ticket ${updatedTicket.id} has been updated.`,
      variant: "default",
    });
  };

  // Function to handle creating a new ticket
  const handleCreateTicket = (newTicket: Partial<Ticket>) => {
    // Generate ticket ID
    const ticketId = `T-${String(tickets.length + 1).padStart(3, '0')}`;
    
    // Create new ticket object
    const ticket: Ticket = {
      id: ticketId,
      title: newTicket.title || "Untitled Ticket",
      description: newTicket.description,
      department: newTicket.department || "IT",
      category: newTicket.category || { name: "Software", icon: "💻" },
      priority: newTicket.priority || "Medium",
      status: newTicket.status || "Received",
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      response: { time: "0m", type: "fast" },
      resolution: { time: null, type: null },
      assignee: newTicket.assignee || "Unassigned",
    };
    
    // Add ticket to list
    setTickets([ticket, ...tickets]);
    
    // Close dialog
    setShowNewTicketDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Created",
      description: `Ticket ${ticketId} has been created.`,
      variant: "default",
    });
  };

  // Function to handle file uploads
  const handleFileUpload = (files: File[]) => {
    // Handle file uploads here (in a real app, you would upload to a server)
    console.log("Files to upload:", files);
    
    // Show notification
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) have been uploaded${uploadingForTicket ? ` for ticket ${uploadingForTicket}` : ''}.`,
      variant: "default",
    });
    
    // Close dialog
    setShowFileUploadDialog(false);
    setUploadingForTicket(undefined);
  };

  // Function to handle uploading files for a specific ticket
  const handleUploadForTicket = (ticketId: string) => {
    setUploadingForTicket(ticketId);
    setShowFileUploadDialog(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-purple-100 text-purple-800">
                  <span className="text-xl">🖥️</span>
                </div>
                <div>
                  <CardTitle className="text-xl">Ticket System</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage software, hardware, and network support requests
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "dashboard" ? "default" : "outline"}
                onClick={() => setViewMode("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                className={viewMode === "table" ? "bg-purple-700 hover:bg-purple-800" : ""}
                onClick={() => setViewMode("table")}
              >
                Table View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-gray-200">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
              <TabsList className="bg-gray-50 p-0 border-b border-gray-200 w-full justify-start rounded-none">
                <TabsTrigger
                  value="userRequests"
                  className={cn(
                    "py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-700 data-[state=active]:shadow-none",
                    activeTab === "userRequests" ? "font-medium" : ""
                  )}
                >
                  User Requests
                </TabsTrigger>
                <TabsTrigger
                  value="hardwareIssues"
                  className={cn(
                    "py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-700 data-[state=active]:shadow-none",
                    activeTab === "hardwareIssues" ? "font-medium" : ""
                  )}
                >
                  Hardware Issues
                </TabsTrigger>
              </TabsList>

              <TabsContent value="userRequests" className="pt-4 px-4 pb-6">
                <div className="flex flex-wrap justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      className="bg-purple-700 hover:bg-purple-800 flex items-center gap-1"
                      onClick={() => setShowNewTicketDialog(true)}
                    >
                      <FilePlus size={16} /> New Ticket
                    </Button>
                    <Button
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => setShowFileUploadDialog(true)}
                    >
                      <Upload size={16} /> Upload
                    </Button>
                    <Button variant="outline" className="flex items-center gap-1">
                      <RotateCw size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search tickets..."
                        className="pl-10"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <Filter size={16} /> Filter
                      </Button>
                      <Button variant="outline" className="flex items-center gap-1">
                        <FileDown size={16} /> Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Response</TableHead>
                          <TableHead>Resolution</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((ticket) => (
                          <TableRow key={ticket.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>{ticket.department}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span>{ticket.category.icon}</span> {ticket.category.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityBadgeClass(ticket.priority)} variant="outline">
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeClass(ticket.status)} variant="outline">
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.createdAt}</TableCell>
                            <TableCell>
                              <span className={getResponseTimeClass(ticket.response.type).className}>
                                {getResponseTimeClass(ticket.response.type).icon} {ticket.response.time}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={getResolutionInfo(ticket.resolution).className}>
                                {getResolutionInfo(ticket.resolution).icon} {getResolutionInfo(ticket.resolution).time}
                              </span>
                            </TableCell>
                            <TableCell>{ticket.assignee}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="View Details"
                                  onClick={() => handleViewTicket(ticket)}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="Edit"
                                  onClick={() => handleEditTicket(ticket)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                                  onClick={() => handleDeleteTicket(ticket)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-purple-500 hover:text-purple-700"
                                  title="Upload Files"
                                  onClick={() => handleUploadForTicket(ticket.id)}
                                >
                                  <Upload size={16} />
                                </Button>
                                {ticket.status !== "Resolved" && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-green-500 hover:text-green-700" 
                                    title="Mark as Resolved"
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      handleMarkAsResolved();
                                    }}
                                  >
                                    <CheckCircle2 size={16} />
                                  </Button>
                                )}
                                {ticket.status !== "In Progress" && ticket.status !== "Resolved" && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-amber-500 hover:text-amber-700" 
                                    title="Approve"
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      handleApproveTicket();
                                    }}
                                  >
                                    <CheckCircle2 size={16} />
                                  </Button>
                                )}
                                {ticket.status !== "Rejected" && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700" 
                                    title="Reject"
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      handleRejectTicket();
                                    }}
                                  >
                                    <AlertCircle size={16} />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hardwareIssues" className="p-4">
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Hardware Issues</h3>
                    <p className="text-gray-500">This section is currently being developed.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <TicketDetailDialog
        ticket={selectedTicket}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onApprove={handleApproveTicket}
        onReject={handleRejectTicket}
        onClose={handleCloseTicket}
        onMarkAsResolved={handleMarkAsResolved}
        onEdit={() => {
          setShowDetailDialog(false);
          setShowEditDialog(true);
        }}
      />

      {/* Ticket Edit Dialog */}
      <TicketEditDialog
        ticket={selectedTicket}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleUpdateTicket}
        onCancel={() => setShowEditDialog(false)}
      />

      {/* New Ticket Dialog */}
      <NewTicketDialog
        open={showNewTicketDialog}
        onOpenChange={setShowNewTicketDialog}
        onSave={handleCreateTicket}
        onCancel={() => setShowNewTicketDialog(false)}
      />

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={showFileUploadDialog}
        onOpenChange={setShowFileUploadDialog}
        onUpload={handleFileUpload}
        ticketId={uploadingForTicket}
      />
    </div>
  );
}

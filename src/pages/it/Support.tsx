
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import TicketDashboard from "@/components/it/support/TicketDashboard";
import TicketTable from "@/components/it/support/TicketTable";
import { Ticket } from "@/components/it/support/types";
import { calculateDashboardMetrics } from "@/components/it/support/ticketUtils";
import useTicketSystem from "@/components/it/support/useTicketSystem";

// Import dialogs
import TicketDetailDialog from "@/components/it/TicketDetailDialog";
import TicketEditDialog from "@/components/it/TicketEditDialog";
import NewTicketDialog from "@/components/it/NewTicketDialog";
import FileUploadDialog from "@/components/it/FileUploadDialog";

export default function ITSupport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"userRequests" | "hardwareIssues">("userRequests");
  const [viewMode, setViewMode] = useState<"dashboard" | "table">("table");

  // Sample data for tickets
  const initialTickets: Ticket[] = [
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
  ];

  // Use the ticket system hook
  const {
    tickets,
    selectedTicket,
    showDetailDialog,
    setShowDetailDialog,
    showEditDialog,
    setShowEditDialog,
    showNewTicketDialog,
    setShowNewTicketDialog,
    showFileUploadDialog,
    setShowFileUploadDialog,
    uploadingForTicket,
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    handleUpdateTicket,
    handleCreateTicket,
    handleFileUpload,
    handleUploadForTicket,
  } = useTicketSystem(initialTickets);

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => calculateDashboardMetrics(tickets), [tickets]);

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
                className={viewMode === "dashboard" ? "bg-purple-700 hover:bg-purple-800" : ""}
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
                {viewMode === "dashboard" ? (
                  <TicketDashboard tickets={tickets} dashboardMetrics={dashboardMetrics} />
                ) : (
                  <TicketTable
                    tickets={tickets}
                    onViewTicket={handleViewTicket}
                    onEditTicket={handleEditTicket}
                    onDeleteTicket={handleDeleteTicket}
                    onUploadForTicket={handleUploadForTicket}
                    onCreateTicket={() => setShowNewTicketDialog(true)}
                    onUpload={() => setShowFileUploadDialog(true)}
                    onMarkAsResolved={handleMarkAsResolved}
                    onApproveTicket={handleApproveTicket}
                    onRejectTicket={handleRejectTicket}
                  />
                )}
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

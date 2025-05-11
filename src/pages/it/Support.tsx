
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import TicketDashboard from "@/components/it/support/TicketDashboard";
import TicketTable from "@/components/it/support/TicketTable";
import { calculateDashboardMetrics } from "@/components/it/support/ticketUtils";
import useTicketSystem from "@/components/it/support/useTicketSystem";

// Import dialogs
import TicketDetailDialog from "@/components/it/TicketDetailDialog";
import TicketEditDialog from "@/components/it/TicketEditDialog";
import NewTicketDialog from "@/components/it/NewTicketDialog";

export default function ITSupport() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"dashboard" | "table">("table");

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
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    handleUpdateTicket,
    handleCreateTicket,
    loading,
    employees
  } = useTicketSystem();

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
            {viewMode === "dashboard" ? (
              <div className="p-4">
                <TicketDashboard tickets={tickets} dashboardMetrics={dashboardMetrics} />
              </div>
            ) : (
              <div className="pt-4 px-4 pb-6">
                <TicketTable
                  tickets={tickets}
                  onViewTicket={handleViewTicket}
                  onEditTicket={handleEditTicket}
                  onDeleteTicket={handleDeleteTicket}
                  onCreateTicket={() => setShowNewTicketDialog(true)}
                  onMarkAsResolved={handleMarkAsResolved}
                  onApproveTicket={handleApproveTicket}
                  onRejectTicket={handleRejectTicket}
                  isLoading={loading}
                />
              </div>
            )}
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
        employees={employees}
      />

      {/* New Ticket Dialog */}
      <NewTicketDialog
        open={showNewTicketDialog}
        onOpenChange={setShowNewTicketDialog}
        onSave={handleCreateTicket}
        onCancel={() => setShowNewTicketDialog(false)}
        employees={employees}
      />
    </div>
  );
}

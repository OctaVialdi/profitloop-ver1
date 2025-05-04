
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/pages/it/Support";

interface TicketDetailDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  onMarkAsResolved: () => void;
  onEdit: () => void;
}

const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onClose,
  onMarkAsResolved,
  onEdit,
}) => {
  if (!ticket) return null;

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

  const getStatusBadgeClass = (status: Ticket["status"]) => {
    switch (status) {
      case "In Progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
          <p className="text-gray-500 text-sm">Ticket information</p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">ID:</p>
                <p>{ticket.id}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Title</p>
            <p className="p-3 border rounded-md">{ticket.title}</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Description</p>
            <p className="p-3 border rounded-md min-h-[100px]">{ticket.description || "No description provided"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium">Department</p>
              <p className="p-3 border rounded-md">{ticket.department}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Category</p>
              <p className="p-3 border rounded-md">
                <span className="inline-flex items-center gap-1">
                  <span>{ticket.category.icon}</span> {ticket.category.name}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium">Priority</p>
              <div>
                <Badge className={getPriorityBadgeClass(ticket.priority)} variant="outline">
                  {ticket.priority}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Status</p>
              <div>
                <Badge className={getStatusBadgeClass(ticket.status)} variant="outline">
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Assignee</p>
            <p className="p-3 border rounded-md">{ticket.assignee}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-4">Approval Process</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800">
                <Check className="h-4 w-4" />
              </div>
              <div className="flex-1 h-1 bg-green-100"></div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800">
                <div className="h-4 w-4 rounded-full border-2 border-current"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-8">
              <div className="text-green-800">Manager</div>
              <div className="text-blue-800">Admin</div>
            </div>

            <div className="bg-green-50 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-1">
                <p className="font-medium">Step 1: Manager Approval</p>
                <Badge className="bg-green-100 text-green-800">Approved</Badge>
              </div>
              <p className="text-sm text-gray-600">Approved by: Jane Smith on 15 Mar 2024, 10.30</p>
              <p className="text-sm italic text-gray-500 mt-2">Initial approval granted</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <div className="flex justify-between mb-1">
                <p className="font-medium">Step 2: Admin Approval</p>
                <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
              </div>
              <p className="text-sm italic text-gray-500">Waiting for final approval</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-2">Approval Status</h3>
            <p className="text-gray-600 mb-2">Current status: {ticket.status}</p>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <p>Step 2 of 2</p>
              <div className="flex items-center text-blue-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="ml-1">Role needed: Admin</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white flex-1"
              onClick={onApprove}
            >
              <Check size={16} /> Approve
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white flex-1"
              onClick={onReject}
            >
              <X size={16} /> Reject
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-4">Activity Timeline</h3>
            <div className="space-y-6">
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                  RB
                </div>
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-medium">Robert Brown</h4>
                    <span className="text-sm text-gray-500">3/15/24, 8:30 AM</span>
                  </div>
                  <p className="font-medium">Ticket created</p>
                  <p className="text-sm text-gray-500">Initial ticket creation</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-500 text-white">
                  JD
                </div>
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-medium">John Doe</h4>
                    <span className="text-sm text-gray-500">3/15/24, 8:55 AM</span>
                  </div>
                  <p className="font-medium">Status changed to In Progress</p>
                  <p className="text-sm text-gray-500">Started working on software installation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={onMarkAsResolved}
            >
              <Check className="mr-1 h-4 w-4" /> Mark as Resolved
            </Button>
            <Button 
              className="bg-purple-700 hover:bg-purple-800"
              onClick={onEdit}
            >
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailDialog;

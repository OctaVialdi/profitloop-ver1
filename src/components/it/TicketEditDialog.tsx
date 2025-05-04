
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/pages/it/Support";
import { Check } from "lucide-react";

interface TicketEditDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
}

interface DropdownOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

const departments: DropdownOption[] = [
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Operations", label: "Operations" },
  { value: "IT", label: "IT" },
  { value: "Sales", label: "Sales" },
  { value: "Executive", label: "Executive" },
];

const categories: DropdownOption[] = [
  { value: "Software", label: "Software", icon: "💻" },
  { value: "Hardware", label: "Hardware", icon: "🖥️" },
  { value: "Network", label: "Network", icon: "🔌" },
];

const priorities: DropdownOption[] = [
  { value: "Low", label: "Low", color: "green" },
  { value: "Medium", label: "Medium", color: "amber" },
  { value: "High", label: "High", color: "red" },
];

const statuses: DropdownOption[] = [
  { value: "Received", label: "Received", color: "gray" },
  { value: "Open", label: "Open", color: "amber" },
  { value: "In Progress", label: "In Progress", color: "purple" },
  { value: "Resolved", label: "Resolved", color: "green" },
  { value: "Maintenance", label: "Maintenance", color: "blue" },
  { value: "Retired", label: "Retired", color: "gray" },
];

const assignees: DropdownOption[] = [
  { value: "", label: "Unassigned" },
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Mike Johnson", label: "Mike Johnson" },
];

const TicketEditDialog: React.FC<TicketEditDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onSave,
  onCancel,
}) => {
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    if (ticket) {
      setEditedTicket({ ...ticket });
    }
  }, [ticket]);

  if (!editedTicket) return null;

  const handleInputChange = (field: keyof Ticket, value: any) => {
    setEditedTicket((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleCategoryChange = (categoryName: string) => {
    const icon = categories.find(c => c.label === categoryName)?.icon || "";
    setEditedTicket((prev) => {
      if (!prev) return null;
      return { 
        ...prev, 
        category: {
          name: categoryName,
          icon
        }
      };
    });
    setShowCategoryDropdown(false);
  };

  const handleSave = () => {
    if (editedTicket) {
      onSave(editedTicket);
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-amber-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-purple-500";
      case "Resolved":
        return "text-green-500";
      case "Open":
        return "text-amber-500";
      case "Maintenance":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <p className="text-gray-500 text-sm">Update ticket information</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Title</label>
            <Input
              value={editedTicket.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description</label>
            <Textarea
              value={editedTicket.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Related Asset <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                placeholder="Search assets by name, type, ID, department..."
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
                  <path d="M21 21L17 17" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Department</label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2.5 border rounded-md cursor-pointer"
                  onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                >
                  <span>{editedTicket.department}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                {showDepartmentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <div 
                        key={dept.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${dept.value === editedTicket.department ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("department", dept.value);
                          setShowDepartmentDropdown(false);
                        }}
                      >
                        {dept.value === editedTicket.department && (
                          <Check className="inline-block mr-2 h-4 w-4" />
                        )}
                        {dept.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Category</label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2.5 border rounded-md cursor-pointer"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <div className="flex items-center gap-1">
                    <span>{editedTicket.category.icon}</span>
                    <span>{editedTicket.category.name}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {categories.map((cat) => (
                      <div 
                        key={cat.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${cat.value === editedTicket.category.name ? 'bg-blue-50' : ''}`}
                        onClick={() => handleCategoryChange(cat.value)}
                      >
                        {cat.value === editedTicket.category.name && (
                          <Check className="inline-block mr-2 h-4 w-4" />
                        )}
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Priority</label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2.5 border rounded-md cursor-pointer"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityDot(editedTicket.priority)}`}></div>
                    <span>{editedTicket.priority}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                {showPriorityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {priorities.map((priority) => (
                      <div 
                        key={priority.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${priority.value === editedTicket.priority ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("priority", priority.value);
                          setShowPriorityDropdown(false);
                        }}
                      >
                        {priority.value === editedTicket.priority ? (
                          <Check className="inline-block mr-2 h-4 w-4" />
                        ) : (
                          <div className={`inline-block w-4 h-4 mx-1`}></div>
                        )}
                        <div className={`inline-block w-2 h-2 rounded-full mr-2 text-${priority.color}-500`} style={{
                          backgroundColor: `currentColor`
                        }}></div>
                        {priority.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Status</label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2.5 border rounded-md cursor-pointer"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(editedTicket.status)}`}></div>
                    <span>{editedTicket.status}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                {showStatusDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {statuses.map((status) => (
                      <div 
                        key={status.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${status.value === editedTicket.status ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("status", status.value);
                          setShowStatusDropdown(false);
                        }}
                      >
                        {status.value === editedTicket.status ? (
                          <Check className="inline-block mr-2 h-4 w-4" />
                        ) : (
                          <div className={`inline-block w-4 h-4 mx-1`}></div>
                        )}
                        <div className={`inline-block w-2 h-2 rounded-full mr-2 text-${status.color}-500`} style={{
                          backgroundColor: `currentColor`
                        }}></div>
                        {status.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Assignee</label>
            <div className="relative">
              <div 
                className="flex items-center justify-between p-2.5 border rounded-md cursor-pointer"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                <span>{editedTicket.assignee || "Unassigned"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              {showAssigneeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {assignees.map((assignee) => (
                    <div 
                      key={assignee.value}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${assignee.value === editedTicket.assignee ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        handleInputChange("assignee", assignee.value);
                        setShowAssigneeDropdown(false);
                      }}
                    >
                      {assignee.value === editedTicket.assignee && (
                        <Check className="inline-block mr-2 h-4 w-4" />
                      )}
                      {assignee.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800" onClick={handleSave}>
            Update Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketEditDialog;

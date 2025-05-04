
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/components/it/support/types";
import { Check } from "lucide-react";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: Partial<Ticket>) => void;
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
];

const assignees: DropdownOption[] = [
  { value: "", label: "Unassigned" },
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Mike Johnson", label: "Mike Johnson" },
];

const NewTicketDialog: React.FC<NewTicketDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  onCancel,
}) => {
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    title: "",
    description: "",
    department: "Marketing",
    category: { name: "Software", icon: "💻" },
    priority: "Medium",
    status: "Received",
    assignee: "John Doe",
  });
  
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const handleInputChange = (field: keyof Ticket, value: any) => {
    setNewTicket((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const handleCategoryChange = (categoryName: string) => {
    const icon = categories.find(c => c.label === categoryName)?.icon || "";
    setNewTicket((prev) => {
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
    onSave(newTicket);
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
      case "Open":
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <p className="text-gray-500 text-sm">Fill in the details to create a new support ticket</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Title</label>
            <Input
              value={newTicket.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter ticket title"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description</label>
            <Textarea
              value={newTicket.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
              placeholder="Describe the issue or request"
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
                  <span>{newTicket.department}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                {showDepartmentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <div 
                        key={dept.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${dept.value === newTicket.department ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("department", dept.value);
                          setShowDepartmentDropdown(false);
                        }}
                      >
                        {dept.value === newTicket.department && (
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
                    <span>{newTicket.category?.icon}</span>
                    <span>{newTicket.category?.name}</span>
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
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${cat.value === newTicket.category?.name ? 'bg-blue-50' : ''}`}
                        onClick={() => handleCategoryChange(cat.value)}
                      >
                        {cat.value === newTicket.category?.name && (
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
                    <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityDot(newTicket.priority || "")}`}></div>
                    <span>{newTicket.priority}</span>
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
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${priority.value === newTicket.priority ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("priority", priority.value);
                          setShowPriorityDropdown(false);
                        }}
                      >
                        {priority.value === newTicket.priority ? (
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
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(newTicket.status || "")}`}></div>
                    <span>{newTicket.status}</span>
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
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${status.value === newTicket.status ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          handleInputChange("status", status.value);
                          setShowStatusDropdown(false);
                        }}
                      >
                        {status.value === newTicket.status ? (
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
                <span>{newTicket.assignee || "Unassigned"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              {showAssigneeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {assignees.map((assignee) => (
                    <div 
                      key={assignee.value}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${assignee.value === newTicket.assignee ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        handleInputChange("assignee", assignee.value);
                        setShowAssigneeDropdown(false);
                      }}
                    >
                      {assignee.value === newTicket.assignee && (
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
            Create Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTicketDialog;

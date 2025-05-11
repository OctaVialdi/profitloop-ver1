
export interface Ticket {
  id: string;
  ticket_id: string;
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
  relatedAsset?: string;
}

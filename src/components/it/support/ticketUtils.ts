
import { Ticket } from "./types";

// Function to get priority badge class
export const getPriorityBadgeClass = (priority: Ticket["priority"]) => {
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
export const getStatusBadgeClass = (status: Ticket["status"]) => {
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
export const getResponseTimeClass = (type: Ticket["response"]["type"]) => {
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
export const getResolutionInfo = (resolution: Ticket["resolution"]) => {
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

// Calculate dashboard metrics from tickets
export const calculateDashboardMetrics = (tickets: Ticket[]) => {
  const openTickets = tickets.filter(t => 
    t.status === "Open" || t.status === "In Progress" || t.status === "Received").length;
  
  // Calculate average response time in minutes (simplified for demo)
  let totalResponseTime = 0;
  tickets.forEach(ticket => {
    const time = ticket.response.time;
    if (time.includes('m')) {
      totalResponseTime += parseInt(time.replace('m', ''));
    } else if (time.includes('h')) {
      const parts = time.split('h ');
      const hours = parseInt(parts[0]);
      const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
      totalResponseTime += (hours * 60) + minutes;
    }
  });
  const avgResponseTime = Math.round(totalResponseTime / tickets.length);
  
  // Calculate SLA compliance (simplified for demo)
  const slaCompliant = tickets.filter(t => t.response.type === "fast" || t.response.type === "medium").length;
  const slaComplianceRate = Math.round((slaCompliant / tickets.length) * 100);
  
  // Calculate resolution rate
  const resolved = tickets.filter(t => t.status === "Resolved").length;
  const resolutionRate = Math.round((resolved / tickets.length) * 100);

  return {
    openTickets,
    avgResponseTime,
    slaComplianceRate,
    resolutionRate
  };
};

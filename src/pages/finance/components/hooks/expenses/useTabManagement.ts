
import { useState } from "react";

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState<"overview" | "compliance" | "approvals">("overview");
  const [expenseView, setExpenseView] = useState<"chart" | "table">("chart");
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "overview" | "compliance" | "approvals");
  };

  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange
  };
}


import { useState } from "react";

export function useTabManagement() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for expense view mode
  const [expenseView, setExpenseView] = useState("table");
  
  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };
  
  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange
  };
}

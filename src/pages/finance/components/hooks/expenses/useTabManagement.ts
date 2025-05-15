
import { useState } from "react";

export type ExpenseActiveTab = "overview" | "compliance" | "approvals";

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState<ExpenseActiveTab>("overview");
  const [expenseView, setExpenseView] = useState("list");
  
  const handleTabChange = (value: string) => {
    // Ensure we only set valid tab values
    if (value === "overview" || value === "compliance" || value === "approvals") {
      setActiveTab(value as ExpenseActiveTab);
    }
  };
  
  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange,
  };
}


import { useState } from "react";

export type TabType = "overview" | "compliance" | "approvals" | "settings";
export type ExpenseViewType = "chart" | "table";

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expenseView, setExpenseView] = useState<ExpenseViewType>("chart");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange
  };
}

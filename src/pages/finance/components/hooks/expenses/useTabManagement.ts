
import { useState } from "react";

export type TabType = "overview" | "compliance" | "approvals";

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expenseView, setExpenseView] = useState<"chart" | "table">("chart");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange
  };
}

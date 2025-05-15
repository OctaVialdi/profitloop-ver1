
import { useState } from "react";

export type ActiveTabType = "overview" | "compliance" | "approvals";

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("overview");
  const [expenseView, setExpenseView] = useState<"table" | "grid">("table");

  const handleTabChange = (value: ActiveTabType) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    expenseView,
    setExpenseView,
    handleTabChange
  };
}

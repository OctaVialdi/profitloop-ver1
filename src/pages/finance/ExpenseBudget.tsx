
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddExpenseDialog from "./components/AddExpenseDialog";

export default function ExpenseBudget() {
  const navigate = useNavigate();
  
  // Budget data
  const budgetCategories = [
    {
      name: "Marketing",
      current: 5000000,
      total: 50000000,
      usedPercentage: 10,
      status: "safe" as const
    },
    {
      name: "IT",
      current: 15000000,
      total: 30000000,
      usedPercentage: 50,
      status: "warning" as const
    },
    {
      name: "Operations",
      current: 0,
      total: 25000000,
      usedPercentage: 0,
      status: "safe" as const
    },
    {
      name: "HR",
      current: 0,
      total: 15000000,
      usedPercentage: 0,
      status: "safe" as const
    }
  ];

  // Handle tab navigation
  const handleTabChange = (value: string) => {
    switch (value) {
      case "overview":
        navigate("/finance/expenses");
        break;
      case "budget":
        // Already on budget page
        break;
      case "compliance":
        navigate("/finance/expenses");
        break;
      case "approvals":
        navigate("/finance/expenses");
        break;
    }
  };

  // Handle budget view selection
  const handleBudgetViewChange = (value: string) => {
    switch (value) {
      case "current":
        // Already on current budget page
        break;
      case "forecast":
        navigate("/finance/expenses/budget/forecast");
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Manage and track your organization's expenses
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex overflow-auto pb-2">
        <Tabs defaultValue="budget" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="bg-muted h-11">
            <TabsTrigger 
              value="overview" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Budget
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="approvals" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Approvals
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Budget View Selector Dropdown */}
      <div className="mb-6">
        <Select defaultValue="current" onValueChange={handleBudgetViewChange}>
          <SelectTrigger className="w-[240px] bg-white">
            <SelectValue placeholder="Select Budget View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Budget</SelectItem>
            <SelectItem value="forecast">Budget Forecast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Tracking Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Tracking</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Over Budget</span>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetCategories.map((category, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <div className="flex items-center">
                <span className="text-sm">
                  Rp{category.current.toLocaleString()} / Rp{category.total.toLocaleString()}
                </span>
                <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Progress
              value={category.usedPercentage}
              className={`h-2 ${
                category.status === "safe" 
                  ? "bg-gray-200" 
                  : category.status === "warning" 
                  ? "bg-yellow-200" 
                  : "bg-red-200"
              }`}
            >
              <div
                className={`h-full ${
                  category.status === "safe" 
                    ? "bg-green-500" 
                    : category.status === "warning" 
                    ? "bg-yellow-500" 
                    : "bg-red-500"
                }`}
                style={{ width: `${category.usedPercentage}%` }}
              ></div>
            </Progress>
            <div className="flex justify-end mt-2">
              <span className="text-sm">{category.usedPercentage}% used</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

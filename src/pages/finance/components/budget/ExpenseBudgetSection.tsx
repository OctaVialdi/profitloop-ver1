
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";

interface BudgetCategory {
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "safe" | "warning" | "over";
}

interface ExpenseBudgetSectionProps {
  budgetCategories: BudgetCategory[];
  budgetView: "current" | "forecast";
  onBudgetViewChange: (value: string) => void;
}

export function ExpenseBudgetSection({
  budgetCategories,
  budgetView,
  onBudgetViewChange,
}: ExpenseBudgetSectionProps) {
  return (
    <div className="space-y-6">
      {/* Budget View Selector Dropdown */}
      <div className="mb-6">
        <Select defaultValue={budgetView} onValueChange={onBudgetViewChange}>
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

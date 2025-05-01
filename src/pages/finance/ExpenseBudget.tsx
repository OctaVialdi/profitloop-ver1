
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit } from "lucide-react";

export default function ExpenseBudget() {
  // Budget data
  const budgetCategories = [
    {
      name: "Marketing",
      current: 5000000,
      total: 50000000,
      usedPercentage: 10,
      status: "safe"
    },
    {
      name: "IT",
      current: 15000000,
      total: 30000000,
      usedPercentage: 50,
      status: "warning"
    },
    {
      name: "Operations",
      current: 0,
      total: 25000000,
      usedPercentage: 0,
      status: "safe"
    },
    {
      name: "HR",
      current: 0,
      total: 15000000,
      usedPercentage: 0,
      status: "safe"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" className="bg-white font-medium px-6 py-6 h-auto">
          Current Budget
        </Button>
        <Button variant="outline" className="bg-muted font-medium px-6 py-6 h-auto flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 22V8L10 2L17 8V22H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V16H13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Budget Forecast
        </Button>
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

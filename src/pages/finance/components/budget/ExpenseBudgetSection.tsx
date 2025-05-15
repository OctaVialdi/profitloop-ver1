
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Check, X } from "lucide-react";

export interface BudgetCategory {
  id: string;
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "safe" | "warning" | "over";
  monthlyBudget: number;
}

interface ExpenseBudgetSectionProps {
  budgetCategories: BudgetCategory[];
  budgetView: string;
  onBudgetViewChange: (value: string) => void;
  onUpdateBudget?: (department: string, budget: number) => void;
  isLoading?: boolean;
}

export function ExpenseBudgetSection({
  budgetCategories,
  budgetView,
  onBudgetViewChange,
  onUpdateBudget,
  isLoading = false,
}: ExpenseBudgetSectionProps) {
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleEdit = (category: BudgetCategory) => {
    setEditingDepartment(category.name);
    setEditValue(category.total);
  };

  const handleSave = (departmentName: string) => {
    if (onUpdateBudget) {
      onUpdateBudget(departmentName, editValue);
    }
    setEditingDepartment(null);
  };

  const handleCancel = () => {
    setEditingDepartment(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Budget Overview</CardTitle>
        <Tabs defaultValue={budgetView} value={budgetView} onValueChange={onBudgetViewChange}>
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading department data...</p>
          </div>
        ) : budgetCategories.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p>No departments found. Please add employees with organizations in HR/Data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgetCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{category.name}</p>
                  <div className="flex items-center gap-1">
                    {editingDepartment === category.name ? (
                      <>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-32 h-8 text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleSave(category.name)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">{category.usedPercentage}%</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 ml-1" 
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{formatRupiah(category.current)}</span>
                  <span className="mx-2">/</span>
                  <span>{formatRupiah(category.total)}</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`absolute h-full ${
                      category.status === "over"
                        ? "bg-red-500"
                        : category.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(category.usedPercentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

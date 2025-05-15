
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/utils/formatUtils";

export interface BudgetCategory {
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "safe" | "warning" | "over";
}

interface ExpenseBudgetSectionProps {
  budgetCategories: BudgetCategory[];
  budgetView: string;
}

export function ExpenseBudgetSection({
  budgetCategories,
  budgetView,
}: ExpenseBudgetSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{category.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{formatRupiah(category.current)}</span>
                    <span className="mx-2">/</span>
                    <span>{formatRupiah(category.total)}</span>
                  </div>
                </div>
                <span className="text-sm font-medium">{category.usedPercentage}%</span>
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
      </CardContent>
    </Card>
  );
}

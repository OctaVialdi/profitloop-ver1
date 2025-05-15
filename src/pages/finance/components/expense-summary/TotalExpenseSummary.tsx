
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/utils/formatUtils";

interface TotalExpenseSummaryProps {
  loading: boolean;
  totalExpense: number;
  expensesCount: number;
}

export function TotalExpenseSummary({
  loading,
  totalExpense,
  expensesCount,
}: TotalExpenseSummaryProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-medium">Total Expenses</p>
            <p className="text-sm opacity-80">{expensesCount} total transactions</p>
          </div>
          <h2 className="text-3xl font-bold">{loading ? 'Loading...' : formatRupiah(totalExpense)}</h2>
        </div>
      </CardContent>
    </Card>
  );
}

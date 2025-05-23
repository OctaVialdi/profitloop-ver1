
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatRupiah } from "@/utils/formatUtils";
import { Expense } from "@/hooks/useExpenses";

interface ExpenseStatsCardsProps {
  loading: boolean;
  totalExpense: number;
  currentMonthExpense: number;
  previousMonthExpense: number;
  monthlyChangePercentage: number;
  highestExpense: {
    amount: number;
    description: string;
    date: string;
  };
  latestExpense: {
    amount: number;
    description: string;
    date: string;
  };
  expenses: Expense[];
}

export function ExpenseStatsCards({
  loading,
  totalExpense,
  currentMonthExpense,
  previousMonthExpense,
  monthlyChangePercentage,
  highestExpense,
  latestExpense,
  expenses,
}: ExpenseStatsCardsProps) {
  // Determine if monthly change is positive or negative
  const isIncreased = monthlyChangePercentage > 0;
  const changeAbsValue = Math.abs(monthlyChangePercentage).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Month Total */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Current Month Total</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{loading ? 'Loading...' : formatRupiah(currentMonthExpense)}</h3>
              <span className={`flex items-center text-xs ${isIncreased ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'} px-2 py-1 rounded-full`}>
                {isIncreased ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} {changeAbsValue}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">vs. {formatRupiah(previousMonthExpense)} last month</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses YTD */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses YTD</p>
            <span className="bg-blue-100 text-blue-600 text-xs py-1 px-2 rounded-full">$</span>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">{loading ? 'Loading...' : formatRupiah(totalExpense)}</h3>
          <p className="text-xs text-muted-foreground mt-1">{expenses.length} transactions</p>
        </CardContent>
      </Card>

      {/* Highest Expense */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Highest Expense</p>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">{loading ? 'Loading...' : formatRupiah(highestExpense.amount)}</h3>
          <p className="text-xs mt-1">{highestExpense.description}</p>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-1"></span> {highestExpense.date}
          </p>
        </CardContent>
      </Card>

      {/* Latest Transaction */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Latest Transaction</p>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium">{latestExpense.description}</h3>
          <h4 className="text-xl font-bold mt-1">{loading ? 'Loading...' : formatRupiah(latestExpense.amount)}</h4>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> {latestExpense.date}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

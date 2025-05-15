
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatRupiah } from "@/utils/formatUtils";
import { Expense, ExpenseCategory } from "@/hooks/useExpenses";
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface MonthlyComparisonChartProps {
  loading: boolean;
  filteredExpenses: Expense[];
  categories: ExpenseCategory[];
}

export function MonthlyComparisonChart({ loading, filteredExpenses, categories }: MonthlyComparisonChartProps) {
  // Generate monthly comparison data based on filtered expenses
  const monthlyComparisonData = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return [];
    }

    // Get current date and calculate the last 6 months
    const currentDate = new Date();
    const monthsToShow = 6;
    const monthlyData: Record<string, {department: number, expense: number}> = {};
    
    // Initialize with empty data for the last 6 months
    for (let i = 0; i < monthsToShow; i++) {
      const date = subMonths(currentDate, i);
      const monthKey = format(date, 'MMM');
      monthlyData[monthKey] = { department: 0, expense: 0 };
    }
    
    // Group filtered expenses by month and department
    filteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      // Only include expenses from the last 6 months
      const sixMonthsAgo = subMonths(new Date(), monthsToShow - 1);
      
      if (expenseDate >= sixMonthsAgo) {
        const monthKey = format(expenseDate, 'MMM');
        
        if (monthlyData[monthKey]) {
          // If department is specified, add to department total
          if (expense.department) {
            monthlyData[monthKey].department += expense.amount;
          }
          // Add to overall expense total
          monthlyData[monthKey].expense += expense.amount;
        }
      }
    });
    
    // Convert to array and format for chart display
    // Sort chronologically by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    
    const sortedMonths = Object.keys(monthlyData)
      .sort((a, b) => {
        const aIndex = monthNames.indexOf(a);
        const bIndex = monthNames.indexOf(b);
        
        // Handle wrapping around the year
        const adjustedAIndex = aIndex <= currentMonthIndex ? aIndex : aIndex - 12;
        const adjustedBIndex = bIndex <= currentMonthIndex ? bIndex : bIndex - 12;
        
        return adjustedAIndex - adjustedBIndex;
      });
    
    return sortedMonths.map(month => ({
      month,
      department: Math.round(monthlyData[month].department / 1000000 * 10) / 10, // Round to 1 decimal place (in millions)
      expense: Math.round(monthlyData[month].expense / 1000000 * 10) / 10 // Round to 1 decimal place (in millions)
    }));
  }, [filteredExpenses]);
  
  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }}>
              {entry.name}: {formatRupiah(entry.value * 1000000)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyComparisonData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barSize={20}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              fontSize={12} 
              tickLine={false} 
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => `${value}M`}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280' }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }}
              iconSize={8}
              iconType="circle"
            />
            <Bar name="Department" dataKey="department" fill="#8884d8" radius={[2, 2, 0, 0]} />
            <Bar name="Expenses" dataKey="expense" fill="#82ca9d" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

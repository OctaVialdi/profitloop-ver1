
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie, Table as TableIcon, ChevronDown } from "lucide-react";
import { ExpenseCategory } from "@/hooks/useExpenses";
import { useState } from "react";

interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
  amount: string;
}

interface ExpenseBreakdownChartProps {
  loading: boolean;
  expenseBreakdownData: ExpenseBreakdownItem[];
  categories: ExpenseCategory[];
}

export function ExpenseBreakdownChart({
  loading,
  expenseBreakdownData,
  categories,
}: ExpenseBreakdownChartProps) {
  const [expenseView, setExpenseView] = useState<'chart' | 'table'>('chart');

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Expense Breakdown</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-3 py-1.5 h-auto text-sm border rounded-lg flex items-center gap-2">
                <span>Category</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id}>{category.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 bg-gray-50 rounded-lg overflow-hidden mb-4">
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-none flex items-center justify-center gap-2 h-10 ${expenseView === 'chart' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setExpenseView('chart')}
          >
            <ChartPie className="h-4 w-4" /> Chart
          </Button>
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-none flex items-center justify-center gap-2 h-10 ${expenseView === 'table' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setExpenseView('table')}
          >
            <TableIcon className="h-4 w-4" /> Table
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <p>Loading expense breakdown...</p>
          </div>
        ) : expenseBreakdownData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <p>No expense data available to display</p>
          </div>
        ) : expenseView === 'chart' ? (
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-4">
              {expenseBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <div className="grid grid-cols-3 pb-3 mb-2 border-b">
              <div className="text-sm font-semibold text-gray-600">Category</div>
              <div className="text-sm font-semibold text-gray-600 text-right">Amount</div>
              <div className="text-sm font-semibold text-gray-600 text-right">%</div>
            </div>
            
            {expenseBreakdownData.map((category, index) => (
              <div key={index} className="grid grid-cols-3 py-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="text-sm text-right">{category.amount}</div>
                <div className="text-sm text-right font-medium">{category.value}%</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

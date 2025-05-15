
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyComparisonItem {
  name: string;
  expense: number;
  income: number;
}

interface MonthlyComparisonChartProps {
  monthlyComparisonData: MonthlyComparisonItem[];
}

export function MonthlyComparisonChart({ monthlyComparisonData }: MonthlyComparisonChartProps) {
  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Comparison</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis 
                tickFormatter={(value) => `${value}k`}
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px", 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  padding: "8px" 
                }}
                formatter={(value) => [`${value}k`, ""]}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                align="right"
                iconSize={10}
                iconType="circle"
              />
              <Bar 
                name="Income" 
                dataKey="income" 
                fill="#4C6FFF" 
                radius={[4, 4, 0, 0]} 
                barSize={14}
              />
              <Bar 
                name="Expenses" 
                dataKey="expense" 
                fill="#FFB547" 
                radius={[4, 4, 0, 0]} 
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4C6FFF]"></div>
            <span className="text-sm">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFB547]"></div>
            <span className="text-sm">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

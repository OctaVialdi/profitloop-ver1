
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ExpenseBudgetForecast() {
  const navigate = useNavigate();
  
  // Forecast data
  const forecastData = [
    { 
      month: "Jan", 
      Marketing: 40000000, 
      IT: 28000000, 
      Operations: 22000000, 
      HR: 12000000 
    },
    { 
      month: "Feb", 
      Marketing: 45000000, 
      IT: 30000000, 
      Operations: 24000000, 
      HR: 13500000 
    },
    { 
      month: "Mar", 
      Marketing: 47000000, 
      IT: 27000000, 
      Operations: 25000000, 
      HR: 14000000 
    },
    { 
      month: "Apr", 
      Marketing: 50000000, 
      IT: 30000000, 
      Operations: 25000000, 
      HR: 15000000 
    },
    { 
      month: "Jun", 
      Marketing: 52000000, 
      IT: 31000000, 
      Operations: 24500000, 
      HR: 16000000 
    },
    { 
      month: "Jul", 
      Marketing: 57000000, 
      IT: 32000000, 
      Operations: 26000000, 
      HR: 17000000 
    },
    { 
      month: "Aug", 
      Marketing: 58000000, 
      IT: 31500000, 
      Operations: 27000000, 
      HR: 18000000 
    },
  ];

  const handleNavigateBack = () => {
    navigate("/finance/expenses/budget");
  };

  // Format the y-axis ticks
  const formatYAxis = (value: number) => {
    if (value === 0) return "0M";
    if (value === 15000000) return "15M";
    if (value === 30000000) return "30M";
    if (value === 45000000) return "45M";
    if (value === 60000000) return "60M";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget Forecast</h2>
          <p className="text-muted-foreground">
            View projected expenses based on historical data and growth patterns
          </p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-medium">
          Forecast Accuracy: 92%
        </div>
      </div>

      {/* Top Navigation */}
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          className="bg-muted font-medium px-6 py-6 h-auto"
          onClick={handleNavigateBack}
        >
          Current Budget
        </Button>
        <Button variant="outline" className="bg-white font-medium px-6 py-6 h-auto flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 22V8L10 2L17 8V22H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V16H13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Budget Forecast
        </Button>
      </div>

      {/* Expense Trend & Forecast */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Expense Trend & Forecast</h3>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={formatYAxis} 
                domain={[0, 60000000]} 
                ticks={[0, 15000000, 30000000, 45000000, 60000000]} 
              />
              <Tooltip 
                formatter={(value: number) => `Rp${(value).toLocaleString()}`}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Marketing"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="IT"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Operations"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="HR"
                stroke="#ea384c"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>* Forecast based on historical spending patterns and growth trends</p>
          <p>* Dotted line indicates projected expenses for future months</p>
        </div>
      </Card>
    </div>
  );
}

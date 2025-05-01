
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddExpenseDialog from "./components/AddExpenseDialog";

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

  // Monthly comparison data
  const monthlyComparisonData = [
    {
      month: "Apr",
      Marketing: 48000000,
      IT: 30000000,
      Operations: 24000000,
      HR: 15000000,
    },
    {
      month: "Jun",
      Marketing: 49000000,
      IT: 30000000,
      Operations: 24500000,
      HR: 16000000,
    },
    {
      month: "Jul",
      Marketing: 57000000,
      IT: 31000000,
      Operations: 26000000,
      HR: 17000000,
    },
    {
      month: "Aug",
      Marketing: 58000000,
      IT: 31000000,
      Operations: 27000000,
      HR: 18000000,
    },
  ];

  // Handle tab navigation
  const handleTabChange = (value: string) => {
    switch (value) {
      case "overview":
        navigate("/finance/expenses");
        break;
      case "budget":
        // Already on budget section
        navigate("/finance/expenses/budget");
        break;
      case "compliance":
        navigate("/finance/expenses");
        break;
      case "approvals":
        navigate("/finance/expenses");
        break;
    }
  };

  // Handle budget view selection
  const handleBudgetViewChange = (value: string) => {
    switch (value) {
      case "current":
        navigate("/finance/expenses/budget");
        break;
      case "forecast":
        // Already on forecast page
        break;
    }
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
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-medium">
            Forecast Accuracy: 92%
          </div>
          <AddExpenseDialog />
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex overflow-auto pb-2">
        <Tabs defaultValue="budget" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="bg-muted h-11">
            <TabsTrigger 
              value="overview" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Budget
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="approvals" 
              className="h-9 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
            >
              Approvals
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Budget View Selector Dropdown */}
      <div className="mb-6">
        <Select defaultValue="forecast" onValueChange={handleBudgetViewChange}>
          <SelectTrigger className="w-[240px] bg-white">
            <SelectValue placeholder="Select Budget View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Budget</SelectItem>
            <SelectItem value="forecast">Budget Forecast</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Budget Comparison */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Monthly Budget Comparison</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComparisonData}
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
                <Bar dataKey="Marketing" fill="#0EA5E9" />
                <Bar dataKey="IT" fill="#10B981" />
                <Bar dataKey="Operations" fill="#F97316" />
                <Bar dataKey="HR" fill="#ea384c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Forecast Analysis */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Forecast Analysis</h3>
          
          <div className="space-y-6">
            {/* Marketing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Marketing</h4>
                <span className="text-red-500 font-medium flex items-center gap-1">
                  920.4% <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current: Rp 5.000.000</span>
                <span>Forecast: Rp 51.018.362</span>
              </div>
              <div className="text-xs text-gray-500">Budget Limit: Rp 50.000.000</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            {/* IT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">IT</h4>
                <span className="text-red-500 font-medium flex items-center gap-1">
                  104.8% <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current: Rp 15.000.000</span>
                <span>Forecast: Rp 30.718.874</span>
              </div>
              <div className="text-xs text-gray-500">Budget Limit: Rp 30.000.000</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            {/* Operations */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Operations</h4>
                <span className="text-red-500 font-medium flex items-center gap-1">
                  Infinity% <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current: Rp 0</span>
                <span>Forecast: Rp 24.684.220</span>
              </div>
              <div className="text-xs text-gray-500">Budget Limit: Rp 25.000.000</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '98%' }}></div>
              </div>
            </div>
            
            {/* HR */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">HR</h4>
                <span className="text-red-500 font-medium flex items-center gap-1">
                  Infinity% <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current: Rp 0</span>
                <span>Forecast: Rp 16.530.884</span>
              </div>
              <div className="text-xs text-gray-500">Budget Limit: Rp 15.000.000</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Review Marketing budget allocation - projected to exceed by 12%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>IT expenses trending upward - monitor closely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>HR spending remains within budget parameters</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

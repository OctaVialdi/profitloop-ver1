
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Monthly revenue data
const monthlyRevenueData = [
  { name: "Jan", revenue: 30000 },
  { name: "Feb", revenue: 38000 },
  { name: "Mar", revenue: 33000 },
  { name: "Apr", revenue: 42000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 58000 },
  { name: "Jul", revenue: 48000 },
  { name: "Aug", revenue: 43000 },
  { name: "Sep", revenue: 63000 },
  { name: "Oct", revenue: 67000 },
  { name: "Nov", revenue: 72000 },
  { name: "Dec", revenue: 80000 },
];

// Deal status data
const dealStatusData = [
  { name: "Closed Won", value: 65 },
  { name: "Closed Lost", value: 35 },
];

export const DashboardTab = () => {
  return (
    <div className="border-t pt-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Charts */}
        <div className="space-y-6">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Deal Status Distribution - Moved under Monthly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dealStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Template</label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly Sales Report</SelectItem>
                  <SelectItem value="monthly">Monthly Sales Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Sales Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Report</SelectItem>
                  <SelectItem value="csv">CSV Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-gray-50 rounded-md space-y-3">
              <h3 className="font-medium">Preview</h3>
              <div className="space-y-1">
                <p className="text-sm">Performa Q2 2024</p>
                <p className="text-sm">Total Revenue: $250,000 (+15%)</p>
                <p className="text-sm">Closing Rate: 35%</p>
                <p className="text-sm">Top Issue: Harga (32% objection)</p>
              </div>
              
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium">Top Performers</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">🏆</span>
                  <p className="text-sm">John Doe: "Deal Closer" (5 deals bulan ini)</p>
                </div>
              </div>
              
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium">Distribution</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <p>Closed Won: 65%</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <p>Closed Lost: 35%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline">Save Template</Button>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Download className="mr-1 h-4 w-4" /> Export as PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

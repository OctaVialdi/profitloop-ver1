
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function PayrollSummary() {
  const [month, setMonth] = useState("April");
  const [year, setYear] = useState("2025");
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll Summary</h2>
          <p className="text-muted-foreground">
            Review and approve payroll expenses across departments
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Month:</span>
            <select className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">
              <option>April</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Year:</span>
            <select className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">
              <option>2025</option>
            </select>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw size={14} />
            <span>Refresh Data</span>
          </Button>
          
          <div className="text-sm">
            <span className="text-muted-foreground mr-1">Current Role:</span>
            <span className="font-medium">finance staff</span>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded mr-3">
            3 Pending Approval
          </div>
          <span className="text-red-700">Payroll needs to be processed before April 25, 2025</span>
        </div>
        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
          Review Now
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Payroll Expense */}
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-gray-500 font-medium">Total Payroll Expense</h3>
            <p className="text-3xl font-bold">Rp 60.000.000</p>
            <p className="text-xs text-gray-500">For April 2025</p>
          </div>
        </Card>
        
        {/* Departments */}
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-gray-500 font-medium">Departments</h3>
            <p className="text-3xl font-bold">5</p>
            <p className="text-xs text-gray-500">Active departments with payroll</p>
          </div>
        </Card>
        
        {/* Employees */}
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-gray-500 font-medium">Employees</h3>
            <p className="text-3xl font-bold">120</p>
            <p className="text-xs text-gray-500">Employees on payroll this month</p>
          </div>
        </Card>
        
        {/* Pending Approval */}
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm text-gray-500 font-medium">Pending Approval</h3>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-gray-500">Payments awaiting approval</p>
          </div>
        </Card>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Budget Check */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selection Message */}
          <Card className="p-6 text-center text-gray-500">
            <p>Select a payroll record to view approval workflow</p>
          </Card>
          
          {/* Budget Check Section */}
          <Card className="overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <div>
                  <h3 className="font-semibold">Budget Check</h3>
                  <p className="text-xs text-gray-500">Verify department budgets before payroll approval</p>
                </div>
              </div>
              <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                Budget Issues Found
              </div>
            </div>
            
            {/* IT Department */}
            <div className="border-b">
              <div className="p-4 flex justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                    <AlertCircle size={14} />
                  </div>
                  <span className="font-medium">IT</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                    Exceeded
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="ml-7">
                  <div className="bg-purple-100 h-4 w-full rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-purple-500" style={{ width: '60%' }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Current: Rp 200.000.000 / Rp 250.000.000</span>
                    <span>⬤ 1</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Payroll: Rp 60.000.000</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span>◦ Budget will be exceeded by Rp 10.000.000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Marketing Department */}
            <div className="border-b">
              <div className="p-4 flex justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                    <AlertCircle size={14} />
                  </div>
                  <span className="font-medium">Marketing</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                    Exceeded
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="ml-7">
                  <div className="bg-purple-100 h-4 w-full rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-purple-500" style={{ width: '70%' }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Current: Rp 150.000.000 / Rp 180.000.000</span>
                    <span>⬤ 1</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Payroll: Rp 45.000.000</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span>◦ Budget will be exceeded by Rp 15.000.000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* HR Department */}
            <div className="border-b">
              <div className="p-4 flex justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="font-medium">HR</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                    OK
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="ml-7">
                  <div className="bg-purple-100 h-4 w-full rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-purple-500" style={{ width: '40%' }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Current: Rp 85.000.000 / Rp 120.000.000</span>
                    <span>⬤ 1</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Payroll: Rp 25.000.000</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span>◦ Rp 10.000.000 will remain after payroll</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Finance Department */}
            <div className="border-b">
              <div className="p-4 flex justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                    <AlertCircle size={14} />
                  </div>
                  <span className="font-medium">Finance</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                    Exceeded
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="ml-7">
                  <div className="bg-purple-100 h-4 w-full rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-purple-500" style={{ width: '65%' }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Current: Rp 125.000.000 / Rp 140.000.000</span>
                    <span>⬤ 1</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Payroll: Rp 25.000.000</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span>◦ Budget will be exceeded by Rp 10.000.000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Operations Department */}
            <div className="border-b">
              <div className="p-4 flex justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                    <AlertCircle size={14} />
                  </div>
                  <span className="font-medium">Operations</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                    Exceeded
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="ml-7">
                  <div className="bg-purple-100 h-4 w-full rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-purple-500" style={{ width: '75%' }}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Current: Rp 155.000.000 / Rp 180.000.000</span>
                    <span>⬤ 1</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Payroll: Rp 60.000.000</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span>◦ Budget will be exceeded by Rp 35.000.000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Section */}
            <div className="p-4 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-semibold">Total Payroll Amount</h3>
                <p className="text-xs text-gray-500">Period</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Rp 60.000.000</p>
                <p className="text-xs text-gray-500">April 2025</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column - Approval Info */}
        <div className="space-y-6">
          {/* Auto-Audit System */}
          <Card className="overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                  <AlertCircle size={14} />
                </div>
                <h3 className="font-semibold">Auto-Audit System</h3>
              </div>
              <div className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded">
                1 Pending
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">AI-powered detection of payroll anomalies</p>
              
              <div className="mt-4">
                <Tabs defaultValue="pending">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs">Resolved</TabsTrigger>
                    <TabsTrigger value="all-flags" className="text-xs">All Flags</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-red-500">High Increase</h4>
                      <p className="text-sm mt-1">Salary increase > 50% detected for IT Department employee EMP001</p>
                      <p className="text-xs text-gray-500 mt-1">Detected on 5/1/2025</p>
                    </div>
                    <Button size="sm" className="bg-white text-red-500 border border-red-500 hover:bg-red-50">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Payment Execution */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 className="font-semibold">Payment Execution</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between mb-6">
                <h4 className="text-sm font-medium">Payment Details</h4>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                  Process Payment
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">Rp 60.000.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Bank Transfer</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Schedule:</span>
                  <span className="font-medium">25 April 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Type:</span>
                  <span className="font-medium">Payroll</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-3">GL Posting Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium">Salary Expenses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">Rp 60.000.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Center:</span>
                    <span className="font-medium">HRD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Code:</span>
                    <span className="font-medium">PPH21</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">PAY-APR2025-001</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Auto-retry settings: 3 attempts</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span>Escalation: Treasury</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

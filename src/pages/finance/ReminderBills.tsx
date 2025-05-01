
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { 
  Calendar,
  CircleAlert, 
  Clock, 
  CheckCircle2, 
  Cog,
  MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";

export default function ReminderBills() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reminder Bills</h2>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Cog className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Bills Navigation - Updated to horizontal with scroll */}
      <Card className="p-1">
        <ScrollArea className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex min-w-max bg-transparent h-auto px-1">
              <TabsTrigger 
                value="overview" 
                className={`data-[state=active]:bg-white ${activeTab === "overview" ? "text-gray-900" : "text-gray-500"}`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming-bills" 
                className={`data-[state=active]:bg-white ${activeTab === "upcoming-bills" ? "text-gray-900" : "text-gray-500"}`}
              >
                Upcoming Bills
              </TabsTrigger>
              <TabsTrigger 
                value="overdue-bills" 
                className={`data-[state=active]:bg-white ${activeTab === "overdue-bills" ? "text-gray-900" : "text-gray-500"}`}
              >
                Overdue Bills
              </TabsTrigger>
              <TabsTrigger 
                value="recurring-setup" 
                className={`data-[state=active]:bg-white ${activeTab === "recurring-setup" ? "text-gray-900" : "text-gray-500"}`}
              >
                Recurring Setup
              </TabsTrigger>
              <TabsTrigger 
                value="auto-payment" 
                className={`data-[state=active]:bg-white ${activeTab === "auto-payment" ? "text-gray-900" : "text-gray-500"}`}
              >
                Auto-Payment
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className={`data-[state=active]:bg-white ${activeTab === "reminders" ? "text-gray-900" : "text-gray-500"}`}
              >
                Reminders
              </TabsTrigger>
              <TabsTrigger 
                value="add-bill" 
                className={`data-[state=active]:bg-white ${activeTab === "add-bill" ? "text-gray-900" : "text-gray-500"}`}
              >
                Add Bill
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className={`data-[state=active]:bg-white ${activeTab === "approvals" ? "text-gray-900" : "text-gray-500"}`}
              >
                Approvals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Bills */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Total Bills</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold">5</p>
              <p className="text-gray-500 text-sm">Total amount: Rp 19.200.000</p>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Overdue</h3>
              <CircleAlert className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-red-500">2</p>
              <p className="text-gray-500 text-sm">Overdue amount: Rp 2.700.000</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Upcoming</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-yellow-500">3</p>
              <p className="text-gray-500 text-sm">Next 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Paid Bills */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Paid Bills</h3>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-green-500">0</p>
              <p className="text-gray-500 text-sm">This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bill Distribution */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Bills Distribution</h3>
              
              {/* Distribution Tabs */}
              <div className="flex space-x-6 mb-6">
                <button className="px-4 py-2 bg-gray-100 rounded-md font-medium text-sm">
                  By Category
                </button>
                <button className="px-4 py-2 text-gray-500 text-sm">
                  By Status
                </button>
                <button className="px-4 py-2 text-gray-500 text-sm">
                  By Department
                </button>
              </div>

              {/* Chart would go here */}
              <div className="h-40 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                Chart placeholder
              </div>
            </CardContent>
          </Card>

          {/* Overdue Bills Table */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-1 text-red-500">Overdue Bills</h3>
              <p className="text-gray-500 text-sm mb-4">Bills that are past their due date</p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-1 h-12 bg-red-500 rounded-full mr-4"></div>
                        <div>
                          <div>Electricity</div>
                          <div className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Recurring
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>26 Apr 2025</div>
                      <div className="text-red-500 text-xs">5 days overdue</div>
                    </TableCell>
                    <TableCell>Rp 1.500.000</TableCell>
                    <TableCell>Utilities</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                        Overdue
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-1 h-12 bg-red-500 rounded-full mr-4"></div>
                        <div>
                          <div>Internet Service</div>
                          <div className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Recurring
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>29 Apr 2025</div>
                      <div className="text-red-500 text-xs">2 days overdue</div>
                    </TableCell>
                    <TableCell>Rp 1.200.000</TableCell>
                    <TableCell>Internet</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                        Overdue
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Bills Table - NEW SECTION */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-1 text-yellow-500">Upcoming Bills</h3>
              <p className="text-gray-500 text-sm mb-4">Bills that need to be paid soon</p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Office Rent */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-1 h-12 bg-red-400 rounded-full mr-4"></div>
                        <div>
                          <div>Office Rent</div>
                          <div className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Recurring
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>16 May 2025</div>
                      <div className="text-gray-500 text-xs">15 days left</div>
                    </TableCell>
                    <TableCell>Rp 5.000.000</TableCell>
                    <TableCell>Rent</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Web Hosting */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-1 h-12 bg-yellow-400 rounded-full mr-4"></div>
                        <div>
                          <div>Web Hosting</div>
                          <div className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Recurring
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>30 Jun 2025</div>
                      <div className="text-gray-500 text-xs">60 days left</div>
                    </TableCell>
                    <TableCell>Rp 3.000.000</TableCell>
                    <TableCell>Hosting</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Insurance Premium */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-1 h-12 bg-green-400 rounded-full mr-4"></div>
                        <div>
                          <div>Insurance Premium</div>
                          <div className="inline-flex items-center mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                            <Calendar className="h-3 w-3 mr-1" />
                            Recurring
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>04 May 2025</div>
                      <div className="text-gray-500 text-xs">3 days left</div>
                    </TableCell>
                    <TableCell>Rp 8.500.000</TableCell>
                    <TableCell>Insurance</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Priority Bills */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-1">Priority Bills</h3>
              <p className="text-gray-500 text-sm mb-4">High priority bills that need attention</p>

              <div className="space-y-4">
                {/* Electricity Bill */}
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">Electricity</h4>
                    <p className="font-medium">Rp 1.500.000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Due: 4/26/2025</p>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>
                  </div>
                </div>

                {/* Internet Service */}
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">Internet Service</h4>
                    <p className="font-medium">Rp 1.200.000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Due: 4/29/2025</p>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Overdue</span>
                  </div>
                </div>

                {/* Office Rent */}
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">Office Rent</h4>
                    <p className="font-medium">Rp 5.000.000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Due: 5/16/2025</p>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">Pending</span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs italic pt-2">
                  These bills require immediate attention based on their due date and priority level
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

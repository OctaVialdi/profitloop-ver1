
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileText,
  Users,
  Filter,
  Plus,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the interface for a bill
interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  submittedBy: string;
  department: string;
  status: "pending" | "approved" | "rejected" | "review_required";
  currentApprover: string;
  attachments: number;
}

export default function BillApprovals() {
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle navigation tabs
  const handleTabChange = (value: string) => {
    if (value !== "approvals") {
      // Navigate to the corresponding tab in the main Reminder Bills page
      if (value === "overview") {
        navigate("/finance/reminder-bills");
      } else {
        navigate("/finance/reminder-bills", { state: { activeTab: value } });
      }
    }
  };

  // Sample data for bills
  const bills: Bill[] = [
    {
      id: "BILL-001",
      name: "Office Rent May 2025",
      amount: 5000000,
      dueDate: "2025-05-30",
      submittedBy: "Ahmad Rizky",
      department: "Operations",
      status: "pending",
      currentApprover: "Finance Manager",
      attachments: 2
    },
    {
      id: "BILL-002",
      name: "Internet Service",
      amount: 2500000,
      dueDate: "2025-05-15",
      submittedBy: "Sarah Putri",
      department: "IT",
      status: "pending",
      currentApprover: "IT Head",
      attachments: 1
    },
    {
      id: "BILL-003",
      name: "Software Licenses",
      amount: 12000000,
      dueDate: "2025-05-20",
      submittedBy: "Budi Santoso",
      department: "IT",
      status: "review_required",
      currentApprover: "Finance Director",
      attachments: 3
    },
    {
      id: "BILL-004",
      name: "Office Supplies",
      amount: 1500000,
      dueDate: "2025-05-10",
      submittedBy: "Diana Wijaya",
      department: "HR",
      status: "approved",
      currentApprover: "CFO",
      attachments: 1
    },
    {
      id: "BILL-005",
      name: "Marketing Campaign",
      amount: 25000000,
      dueDate: "2025-06-01",
      submittedBy: "Reza Fahlevi",
      department: "Marketing",
      status: "rejected",
      currentApprover: "Marketing Head",
      attachments: 4
    }
  ];

  // Filter bills based on the active tab
  const filteredBills = bills.filter(bill => {
    if (activeTab === "pending") return bill.status === "pending";
    if (activeTab === "review_required") return bill.status === "review_required";
    if (activeTab === "approved") return bill.status === "approved";
    if (activeTab === "rejected") return bill.status === "rejected";
    return true; // "all" tab
  });

  const handleAction = (action: "approve" | "reject" | "review", billId: string) => {
    // In a real app, this would make an API call to update the bill status
    toast({
      title: `Bill ${billId} ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "sent for review"}`,
      description: `The bill has been ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "sent for review"} successfully.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Bill["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "review_required":
        return <Badge className="bg-blue-500">Review Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reminder Bills</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Bill
          </Button>
        </div>
      </div>

      {/* Top Navigation Tabs - Same as in ReminderBills.tsx */}
      <Card className="p-1">
        <ScrollArea className="w-full">
          <Tabs value="approvals" onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex min-w-max bg-transparent h-auto px-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming-bills" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Upcoming Bills
              </TabsTrigger>
              <TabsTrigger 
                value="overdue-bills" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Overdue Bills
              </TabsTrigger>
              <TabsTrigger 
                value="recurring-setup" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Recurring Setup
              </TabsTrigger>
              <TabsTrigger 
                value="auto-payment" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Auto-Payment
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Reminders
              </TabsTrigger>
              <TabsTrigger 
                value="add-bill" 
                className="data-[state=active]:bg-white text-gray-500"
              >
                Add Bill
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="data-[state=active]:bg-white text-gray-900"
              >
                Approvals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>
      </Card>

      {/* Bills Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Pending Approvals</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-yellow-500">2</p>
              <p className="text-gray-500 text-sm">Awaiting your review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Need Review</h3>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-blue-500">1</p>
              <p className="text-gray-500 text-sm">Additional information needed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Approved</h3>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-green-500">1</p>
              <p className="text-gray-500 text-sm">This month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-500 font-medium">Rejected</h3>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-red-500">1</p>
              <p className="text-gray-500 text-sm">This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills Navigation with scroll */}
      <Card className="p-1">
        <ScrollArea className="w-full">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="flex min-w-max bg-transparent h-auto px-1">
              <TabsTrigger 
                value="all" 
                className={`data-[state=active]:bg-white ${activeTab === "all" ? "text-gray-900" : "text-gray-500"}`}
              >
                All Bills
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className={`data-[state=active]:bg-white ${activeTab === "pending" ? "text-gray-900" : "text-gray-500"}`}
              >
                Pending Approval
              </TabsTrigger>
              <TabsTrigger 
                value="review_required" 
                className={`data-[state=active]:bg-white ${activeTab === "review_required" ? "text-gray-900" : "text-gray-500"}`}
              >
                Need Review
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className={`data-[state=active]:bg-white ${activeTab === "approved" ? "text-gray-900" : "text-gray-500"}`}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className={`data-[state=active]:bg-white ${activeTab === "rejected" ? "text-gray-900" : "text-gray-500"}`}
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search bills by ID, name, or department..." 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bills Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Bill ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Approver</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>
                    <div>
                      {bill.name}
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        {bill.submittedBy}
                        <span className="mx-1">•</span>
                        <FileText className="h-3 w-3 mr-1" />
                        {bill.attachments} files
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                  <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{bill.department}</TableCell>
                  <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  <TableCell>{bill.currentApprover}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(bill.status === "pending" || bill.status === "review_required") && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAction("approve", bill.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction("reject", bill.id)}
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction("review", bill.id)}
                          >
                            Review
                          </Button>
                        </>
                      )}
                      {bill.status === "approved" && (
                        <Button size="sm" variant="ghost" disabled>
                          Approved
                        </Button>
                      )}
                      {bill.status === "rejected" && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 font-medium">No bills found</p>
                      <p className="text-gray-400 text-sm">
                        There are no bills matching your current filter
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Workflow Rules */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Current Approval Workflow</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">1</div>
              <div>
                <p className="font-medium">Department Head Approval</p>
                <p className="text-sm text-gray-500">Required for all bills</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">2</div>
              <div>
                <p className="font-medium">Finance Manager Approval</p>
                <p className="text-sm text-gray-500">Required for bills &gt; Rp 5.000.000</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">3</div>
              <div>
                <p className="font-medium">CFO Approval</p>
                <p className="text-sm text-gray-500">Required for bills &gt; Rp 10.000.000</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

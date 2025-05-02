import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MoreHorizontal, FileText, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SalesPage() {
  const {
    organization
  } = useOrganization();
  const [activeTab, setActiveTab] = useState("activities");

  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Operations</h2>
        <p className="text-muted-foreground">
          Sales management for {organization?.name || "your organization"}
        </p>
      </div>

      <div>
        <div className="mb-6">
          <Tabs defaultValue="activities" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="gamification">Gamification</TabsTrigger>
              <TabsTrigger value="okr">OKR System</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Revenue Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <div className="flex items-center mt-2">
                <h3 className="text-3xl font-bold">$250K</h3>
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                  +12%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Closing Rate Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Closing Rate</p>
              <h3 className="text-3xl font-bold mt-2">35%</h3>
            </CardContent>
          </Card>

          {/* Average Deal Size Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Avg. Deal Size</p>
              <h3 className="text-3xl font-bold mt-2">$12K</h3>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Target Progress */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Monthly Target Progress</p>
              <p className="text-sm font-medium">$300K / $500K</p>
            </div>
            <Progress value={60} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              <p>Top Performer: Jane Doe</p>
              <p>$78K revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conditional content based on active tab */}
      {activeTab === "pipeline" ? (
        <div className="border-t pt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">Sales Pipeline</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">Lead</h4>
                      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">1</span>
                    </div>
                  </div>
                  
                  <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Future Enterprises</h5>
                      <p className="text-sm text-gray-500 mb-2">Cold Call</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">Demo</h4>
                      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">2</span>
                    </div>
                  </div>
                  
                  <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Global Innovations</h5>
                      <p className="text-sm text-gray-500 mb-2">Meeting</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Nexus Group</h5>
                      <p className="text-sm text-gray-500 mb-2">Meeting</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">Negotiation</h4>
                      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">3</span>
                    </div>
                  </div>
                  
                  <Card className="shadow-sm border-red-100">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Acme Corp</h5>
                      <p className="text-sm text-gray-500 mb-1">Demo</p>
                      <p className="text-sm font-medium">$52,000</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-yellow-100">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Stellar Systems</h5>
                      <p className="text-sm text-gray-500 mb-1">Proposal</p>
                      <p className="text-sm font-medium">$28,000</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-red-100">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Quantum Industries</h5>
                      <p className="text-sm text-gray-500 mb-1">Demo</p>
                      <p className="text-sm font-medium">$65,000</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">Closed Won</h4>
                      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">1</span>
                    </div>
                  </div>
                  
                  <Card className="shadow-sm border-green-200">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-1">Tech Solutions</h5>
                      <p className="text-sm text-gray-500 mb-1">Closing</p>
                      <p className="text-sm font-medium">$15,000</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-10 bg-red-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-medium text-red-700">Deals At Risk</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="border-b border-red-200 pb-6">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Stellar Systems</h4>
                      <span className="text-sm text-red-600">Risk Score: 60%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Proposal - Negotiation • $28,000</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        No updates for 13 days
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        Negotiation taking longer than average
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Schedule Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Send Email
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Quantum Industries</h4>
                      <span className="text-sm text-red-600">Risk Score: 60%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Demo - Negotiation • $65,000</p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        No updates for 16 days
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        Negotiation taking longer than average
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Schedule Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="border-t pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Sales Activities</h3>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="mr-1 h-4 w-4" /> New Activity
                </Button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by client or status..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="min-w-[140px] justify-between">
                    All Types
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </Button>
                  <Button variant="outline" className="min-w-[180px] justify-between">
                    <Calendar className="h-4 w-4 mr-2" /> 
                    Select date range
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Apr 28, 2025</TableCell>
                      <TableCell>Acme Corp</TableCell>
                      <TableCell>
                        Demo <Badge variant="secondary" className="ml-1 bg-gray-100">2</Badge>
                      </TableCell>
                      <TableCell>$52,000</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Negotiation
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 27, 2025</TableCell>
                      <TableCell>Tech Solutions</TableCell>
                      <TableCell>
                        Closing <Badge variant="secondary" className="ml-1 bg-gray-100">2</Badge>
                      </TableCell>
                      <TableCell>$15,000</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Closed Won
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 26, 2025</TableCell>
                      <TableCell>Global Innovations</TableCell>
                      <TableCell>
                        Meeting <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          Ongoing
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 25, 2025</TableCell>
                      <TableCell>Stellar Systems</TableCell>
                      <TableCell>
                        Proposal <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                      </TableCell>
                      <TableCell>$28,000</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Negotiation
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 24, 2025</TableCell>
                      <TableCell>Future Enterprises</TableCell>
                      <TableCell>
                        Cold Call <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          Ongoing
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 22, 2025</TableCell>
                      <TableCell>Quantum Industries</TableCell>
                      <TableCell>
                        Demo <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                      </TableCell>
                      <TableCell>$65,000</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Negotiation
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 21, 2025</TableCell>
                      <TableCell>Nexus Group</TableCell>
                      <TableCell>
                        Meeting
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          Ongoing
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>;
}

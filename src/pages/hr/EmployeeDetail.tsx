
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useEmployees } from "@/hooks/useEmployees";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees } = useEmployees();
  const [activeTab, setActiveTab] = useState("basic-info");

  // Find the employee with the matching ID
  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate("/hr/data")}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee List</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with profile picture and navigation */}
        <div className="w-full md:w-64 space-y-4">
          <Card className="p-6 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-2">
              <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center text-xl font-medium">
                {employee.name.charAt(0)}
              </div>
            </Avatar>
            <h3 className="text-lg font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.jobPosition || "-"}</p>
          </Card>

          <Card>
            <div className="py-2">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-primary">
                General
              </div>
              <div className="pl-6 space-y-1">
                <div className={`px-4 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab.startsWith('basic-info') ? 'text-primary' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('basic-info')}>
                  Personal
                </div>
                <div className={`px-4 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'employment' ? 'text-primary' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('employment')}>
                  Employment
                </div>
                <div className={`px-4 py-1.5 hover:bg-gray-100 cursor-pointer ${activeTab === 'education' ? 'text-primary' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('education')}>
                  Education & Experience
                </div>
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'time-management' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('time-management')}>
                Time Management
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'payroll' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('payroll')}>
                Payroll
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'finance' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('finance')}>
                Finance
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'files' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('files')}>
                Files
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'assets' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('assets')}>
                Assets
              </div>
              <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeTab === 'history' ? 'text-primary font-medium' : 'text-gray-700'}`}
                onClick={() => setActiveTab('history')}>
                History
              </div>
            </div>
          </Card>
        </div>

        {/* Main content area with tabs */}
        <div className="flex-1">
          {activeTab === 'basic-info' && (
            <Card>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Personal</h2>
                </div>

                <Tabs defaultValue="basic-info">
                  <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
                    <TabsTrigger value="basic-info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Basic info
                    </TabsTrigger>
                    <TabsTrigger value="family" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Family
                    </TabsTrigger>
                    <TabsTrigger value="emergency" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Emergency contact
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic-info" className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Personal data</h3>
                        <p className="text-sm text-gray-500 mb-4">Your email address is your identity on Talenta is used to log in.</p>
                        
                        <div className="border rounded-md">
                          <div className="flex justify-between items-center p-3 border-b">
                            <div></div>
                            <Button size="sm" variant="outline" className="gap-2 flex items-center">
                              <Edit size={14} /> Edit
                            </Button>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Full name</p>
                                <p className="font-medium">{employee.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Mobile phone</p>
                                <p className="font-medium">{employee.mobilePhone || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{employee.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{employee.mobilePhone || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Place of birth</p>
                                <p className="font-medium">{employee.birthPlace || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Birthdate</p>
                                <p className="font-medium">
                                  {employee.birthDate || "-"} 
                                  {employee.birthDate && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">30 years old</span>}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="font-medium">{employee.gender || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Marital status</p>
                                <p className="font-medium">{employee.maritalStatus || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Blood type</p>
                                <p className="font-medium">O</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Religion</p>
                                <p className="font-medium">{employee.religion || "-"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Identity & Address</h3>
                        <div className="border rounded-md">
                          <div className="flex justify-between items-center p-3 border-b">
                            <div></div>
                            <Button size="sm" variant="outline" className="gap-2 flex items-center">
                              <Edit size={14} /> Edit
                            </Button>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              <div>
                                <p className="text-sm text-gray-500">NIK (NPWP 16 digit)</p>
                                <p className="font-medium">-</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Passport number</p>
                                <p className="font-medium">-</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Passport expiration date</p>
                                <p className="font-medium">-</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Postal code</p>
                                <p className="font-medium">-</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Citizen ID address</p>
                                <p className="font-medium">-</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Residential address</p>
                                <p className="font-medium">{employee.address || "-"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="family" className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 mb-4">
                        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium">There is no data to display</h3>
                      <p className="text-gray-500 mt-2">Your family information data will be displayed here.</p>
                      
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="sm">Add new</Button>
                        <Button size="sm" variant="outline">Import</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emergency" className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 mb-4">
                        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium">There is no data to display</h3>
                      <p className="text-gray-500 mt-2">Your emergency contact data will be displayed here.</p>
                      
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="sm">Add new</Button>
                        <Button size="sm" variant="outline">Import</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          )}

          {activeTab === 'employment' && (
            <Card>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Employment</h2>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Employment data</h3>
                  <p className="text-sm text-gray-500 mb-4">Your data information related to company.</p>
                  
                  <div className="border rounded-md">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div></div>
                      <Button size="sm" variant="outline" className="gap-2 flex items-center">
                        <Edit size={14} /> Edit
                      </Button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Company name</p>
                          <p className="font-medium">PT CHEMISTRY BEAUTY INDONESIA</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Employee ID</p>
                          <p className="font-medium">{employee.employeeId || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Barcode</p>
                          <p className="font-medium">{employee.barcode || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Organization name</p>
                          <p className="font-medium">{employee.organization || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Job position</p>
                          <p className="font-medium">{employee.jobPosition || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Job level</p>
                          <p className="font-medium">{employee.jobLevel || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Employment status</p>
                          <p className="font-medium">{employee.employmentStatus || "Permanent"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Branch</p>
                          <p className="font-medium">{employee.branch || "Pusat"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Join date</p>
                          <p className="font-medium">
                            {employee.joinDate || "-"}
                            {employee.joinDate && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">14 Year 5 Month 24 Day</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sign date</p>
                          <p className="font-medium">{employee.signDate || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'education' && (
            <Card>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Education & experience</h2>
                </div>

                <Tabs defaultValue="formal-education">
                  <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
                    <TabsTrigger value="formal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Formal education
                    </TabsTrigger>
                    <TabsTrigger value="informal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Informal education
                    </TabsTrigger>
                    <TabsTrigger value="working-experience" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
                      Working experience
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="formal-education" className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 mb-4">
                        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium">There is no data to display</h3>
                      <p className="text-gray-500 mt-2">Your formal education data will be displayed here.</p>
                      
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="sm">Add new</Button>
                        <Button size="sm" variant="outline">Import</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="informal-education" className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 mb-4">
                        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium">There is no data to display</h3>
                      <p className="text-gray-500 mt-2">Your informal education data will be displayed here.</p>
                      
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="sm">Add new</Button>
                        <Button size="sm" variant="outline">Import</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="working-experience" className="pt-6">
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 mb-4">
                        <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium">There is no data to display</h3>
                      <p className="text-gray-500 mt-2">Your working experience data will be displayed here.</p>
                      
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="sm">Add new</Button>
                        <Button size="sm" variant="outline">Import</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          )}

          {(activeTab === 'time-management' || activeTab === 'payroll' || activeTab === 'finance' || 
            activeTab === 'files' || activeTab === 'assets' || activeTab === 'history') && (
            <Card>
              <div className="p-6 text-center py-12">
                <h2 className="text-2xl font-bold mb-6">{activeTab.split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}</h2>
                <div className="mx-auto w-24 h-24 mb-4">
                  <img src="/placeholder.svg" alt="No data" className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium">This section is under development</h3>
                <p className="text-gray-500 mt-2">We're working hard to bring this feature to you soon.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

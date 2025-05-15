
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Plus, Search, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TrainingProgramDialog } from "@/components/hr/training/TrainingProgramDialog";
import { TrainingDetailDialog } from "@/components/hr/training/TrainingDetailDialog";
import { TrainingBudgetCard } from "@/components/hr/training/TrainingBudgetCard";
import { SkillsGapCard } from "@/components/hr/training/SkillsGapCard";
import { TrainingProgramList } from "@/components/hr/training/TrainingProgramList";

export default function HRTraining() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("aktif");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua Status");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Semua Departemen");
  
  const handleAddProgram = () => {
    setShowAddDialog(true);
  };
  
  const handleProgramDetail = (program: any) => {
    setSelectedProgram(program);
    setShowDetailDialog(true);
  };
  
  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedCategory("Semua Kategori");
    setSelectedStatus("Semua Status");
    setSelectedDepartment("Semua Departemen");
    setSelectedDate(undefined);
    toast({
      title: "Filter direset",
      description: "Semua filter telah dikembalikan ke nilai awal"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Training</h1>
        <Button onClick={handleAddProgram} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Tambah Program Training
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrainingBudgetCard />
        <SkillsGapCard />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="aktif" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                Program Aktif
              </TabsTrigger>
              <TabsTrigger value="kalender" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                Kalender
              </TabsTrigger>
              <TabsTrigger value="selesai" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                Selesai
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Search and filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari program training..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full h-10 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[180px] justify-between">
                      {selectedCategory}
                      <Filter className="h-4 w-4 ml-2 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <div className="py-2">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Semua Kategori")}
                      >
                        {selectedCategory === "Semua Kategori" && <span className="mr-2">✓</span>}
                        Semua Kategori
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Management")}
                      >
                        {selectedCategory === "Management" && <span className="mr-2">✓</span>}
                        Management
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Leadership")}
                      >
                        {selectedCategory === "Leadership" && <span className="mr-2">✓</span>}
                        Leadership
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Technical")}
                      >
                        {selectedCategory === "Technical" && <span className="mr-2">✓</span>}
                        Technical
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Marketing")}
                      >
                        {selectedCategory === "Marketing" && <span className="mr-2">✓</span>}
                        Marketing
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Sales")}
                      >
                        {selectedCategory === "Sales" && <span className="mr-2">✓</span>}
                        Sales
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("Finance")}
                      >
                        {selectedCategory === "Finance" && <span className="mr-2">✓</span>}
                        Finance
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("IT")}
                      >
                        {selectedCategory === "IT" && <span className="mr-2">✓</span>}
                        IT
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedCategory("HR")}
                      >
                        {selectedCategory === "HR" && <span className="mr-2">✓</span>}
                        HR
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[180px] justify-between">
                      {selectedStatus}
                      <Filter className="h-4 w-4 ml-2 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <div className="py-2">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedStatus("Semua Status")}
                      >
                        {selectedStatus === "Semua Status" && <span className="mr-2">✓</span>}
                        Semua Status
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedStatus("Persiapan")}
                      >
                        {selectedStatus === "Persiapan" && <span className="mr-2">✓</span>}
                        Persiapan
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedStatus("Sedang Berjalan")}
                      >
                        {selectedStatus === "Sedang Berjalan" && <span className="mr-2">✓</span>}
                        Sedang Berjalan
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedStatus("Selesai")}
                      >
                        {selectedStatus === "Selesai" && <span className="mr-2">✓</span>}
                        Selesai
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedStatus("Dibatalkan")}
                      >
                        {selectedStatus === "Dibatalkan" && <span className="mr-2">✓</span>}
                        Dibatalkan
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[200px] justify-between">
                      {selectedDepartment}
                      <Filter className="h-4 w-4 ml-2 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <div className="py-2">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Semua Departemen")}
                      >
                        {selectedDepartment === "Semua Departemen" && <span className="mr-2">✓</span>}
                        Semua Departemen
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("IT")}
                      >
                        {selectedDepartment === "IT" && <span className="mr-2">✓</span>}
                        IT
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("HR")}
                      >
                        {selectedDepartment === "HR" && <span className="mr-2">✓</span>}
                        HR
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Finance")}
                      >
                        {selectedDepartment === "Finance" && <span className="mr-2">✓</span>}
                        Finance
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Marketing")}
                      >
                        {selectedDepartment === "Marketing" && <span className="mr-2">✓</span>}
                        Marketing
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Sales")}
                      >
                        {selectedDepartment === "Sales" && <span className="mr-2">✓</span>}
                        Sales
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Operations")}
                      >
                        {selectedDepartment === "Operations" && <span className="mr-2">✓</span>}
                        Operations
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Customer Support")}
                      >
                        {selectedDepartment === "Customer Support" && <span className="mr-2">✓</span>}
                        Customer Support
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => setSelectedDepartment("Legal")}
                      >
                        {selectedDepartment === "Legal" && <span className="mr-2">✓</span>}
                        Legal
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[200px] justify-between">
                      {selectedDate ? format(selectedDate, "dd MMMM yyyy") : "Pilih rentang tanggal"}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" onClick={handleResetFilter}>
                  Reset
                </Button>
              </div>

              {/* Display content based on active tab */}
              {activeTab === "aktif" && (
                <TrainingProgramList 
                  activeTab={activeTab} 
                  onProgramClick={handleProgramDetail} 
                />
              )}
              
              {activeTab === "kalender" && (
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-1/3 border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Kalender Training</h3>
                    <div className="bg-white rounded-md">
                      <div className="flex justify-between py-2 px-1">
                        <button className="p-1">&lt;</button>
                        <h3 className="font-medium">May 2025</h3>
                        <button className="p-1">&gt;</button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-1">
                        <div>Su</div>
                        <div>Mo</div>
                        <div>Tu</div>
                        <div>We</div>
                        <div>Th</div>
                        <div>Fr</div>
                        <div>Sa</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-sm">
                        {Array(31).fill(0).map((_, i) => {
                          const isActive = i + 1 === 3 || i + 1 === 11 || i + 1 === 18 || i + 1 === 25;
                          return (
                            <button 
                              key={i} 
                              className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center",
                                isActive ? "bg-purple-600 text-white" : "hover:bg-gray-100"
                              )}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3">
                    <div className="border rounded-md p-4 mb-4">
                      <h3 className="text-lg font-medium mb-2">Program Training - 03 May 2025</h3>
                      <p className="text-gray-500">Tidak ada program training pada tanggal ini</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "selesai" && (
                <TrainingProgramList 
                  activeTab={activeTab} 
                  onProgramClick={handleProgramDetail} 
                />
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add Training Program Dialog */}
      <TrainingProgramDialog 
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
      
      {/* Training Detail Dialog */}
      {selectedProgram && (
        <TrainingDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          program={selectedProgram}
        />
      )}
    </div>
  );
}

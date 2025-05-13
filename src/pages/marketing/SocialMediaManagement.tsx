import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Edit, X, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContentPlan } from "./components/ContentPlan";
import { ContentTable } from "./components/ContentTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ContentManager {
  name: string;
  dailyTarget: number;
  monthlyTarget: number;
  monthlyTargetAdjusted: number;
  progress: number;
  onTimeRate: number;
  effectiveRate: number;
  score: number;
}

interface TabData {
  id: string;
  label: string;
}

const SocialMediaManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("content-planner");
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ContentManager | null>(null);
  const [targetValue, setTargetValue] = useState<string>("20");
  
  const primaryTabs: TabData[] = [
    { id: "content-planner", label: "Content Planner" },
    { id: "production", label: "Production" },
    { id: "content-post", label: "Content Post" }
  ];

  const secondaryTabs: TabData[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "content", label: "Content" },
    { id: "create-content", label: "Create Content" },
    { id: "content-bank", label: "Content Bank" },
    { id: "content-qc", label: "Content QC" }
  ];

  const contentManagers: ContentManager[] = [
    {
      name: "John Doe",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 20,
      progress: 75,
      onTimeRate: 80,
      effectiveRate: 90,
      score: 82
    },
    {
      name: "Jane Smith",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 15,
      progress: 80,
      onTimeRate: 70,
      effectiveRate: 85,
      score: 78
    },
    {
      name: "Mike Johnson",
      dailyTarget: 15,
      monthlyTarget: 15,
      monthlyTargetAdjusted: 18,
      progress: 65,
      onTimeRate: 75,
      effectiveRate: 80,
      score: 76
    },
    {
      name: "Sara Williams",
      dailyTarget: 18,
      monthlyTarget: 18,
      monthlyTargetAdjusted: 20,
      progress: 85,
      onTimeRate: 85,
      effectiveRate: 88,
      score: 86
    }
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case "content-planner":
        return "Target Quantity Content Planner";
      case "production":
        return "Target Quantity Production Team";
      case "content-post":
        return "Target Quantity Post Content";
      default:
        return "Social Media Management";
    }
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const handleEditTarget = (manager: ContentManager) => {
    setEditingManager(manager);
    setTargetValue(manager.monthlyTargetAdjusted.toString());
    setIsEditTargetOpen(true);
  };

  const handleSaveTarget = () => {
    // In a real app, you would update the manager's target here
    setIsEditTargetOpen(false);
    setEditingManager(null);
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const renderMonthCalendar = () => {
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get days from previous month to fill the first week
    const prevMonthDays = [];
    const prevMonth = subMonths(selectedMonth, 1);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      prevMonthDays.unshift(daysInPrevMonth - i);
    }
    
    // Current month days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Calculate how many days we need from next month
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const nextMonthDays = Array.from({ length: totalCells - (prevMonthDays.length + days.length) }, (_, i) => i + 1);
    
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handlePreviousMonth} 
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-xl font-medium">
            {format(selectedMonth, "MMMM yyyy")}
          </div>
          <button 
            onClick={handleNextMonth} 
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map(day => (
            <div key={day} className="text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}
          {prevMonthDays.map(day => (
            <div key={`prev-${day}`} className="py-2 text-gray-300">
              {day}
            </div>
          ))}
          {days.map(day => {
            const isToday = 
              day === new Date().getDate() && 
              currentMonth === new Date().getMonth() && 
              currentYear === new Date().getFullYear();
            const isSelected = 
              day === selectedDate.getDate() && 
              currentMonth === selectedDate.getMonth() && 
              currentYear === selectedDate.getFullYear();
            
            return (
              <div 
                key={`current-${day}`}
                className={`py-2 cursor-pointer rounded-full hover:bg-gray-100 ${isToday ? 'font-bold' : ''} ${
                  isSelected ? 'bg-purple-500 text-white hover:bg-purple-600' : ''
                }`}
                onClick={() => {
                  setSelectedDate(new Date(currentYear, currentMonth, day));
                  setIsCalendarOpen(false);
                }}
              >
                {day}
              </div>
            );
          })}
          {nextMonthDays.map(day => (
            <div key={`next-${day}`} className="py-2 text-gray-300">
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (activeTab === "content-planner") {
      return (
        <Card className="w-full border shadow-sm">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-lg">{getTabTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-8 w-[150px] py-1 text-center">PIC</TableHead>
                      <TableHead className="h-8 text-center w-[150px] py-1">
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="flex items-center justify-center gap-1 w-full font-normal text-xs h-7 px-2"
                            >
                              <span>{format(selectedDate, "dd MMM yyyy")}</span>
                              <CalendarIcon className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {renderMonthCalendar()}
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-8 text-center w-[150px] py-1">
                        <DropdownMenu 
                          open={isMonthSelectorOpen} 
                          onOpenChange={setIsMonthSelectorOpen}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="flex items-center justify-center gap-1 w-full font-normal text-xs h-7 px-2"
                            >
                              <span>{format(selectedMonth, "MMMM yyyy")}</span>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                            {months.map((month, index) => {
                              const isCurrentYear = new Date().getFullYear() === selectedMonth.getFullYear();
                              const isCurrentMonth = index === selectedMonth.getMonth() && isCurrentYear;
                              
                              return (
                                <DropdownMenuItem
                                  key={month}
                                  className={`flex items-center py-1 px-4 text-xs ${isCurrentMonth ? 'bg-gray-100' : ''}`}
                                  onClick={() => {
                                    setSelectedMonth(new Date(selectedMonth.getFullYear(), index));
                                    setIsMonthSelectorOpen(false);
                                  }}
                                >
                                  {isCurrentMonth && (
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className="h-3 w-3 mr-2 text-blue-500" 
                                      viewBox="0 0 20 20" 
                                      fill="currentColor"
                                    >
                                      <path 
                                        fillRule="evenodd" 
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                        clipRule="evenodd" 
                                      />
                                    </svg>
                                  )}
                                  {month} {selectedMonth.getFullYear()}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                      <TableHead className="h-8 text-center w-[150px] py-1">
                        Target {format(selectedMonth, "MMM yyyy")}
                      </TableHead>
                      <TableHead className="h-8 w-[200px] py-1 text-center">Progress</TableHead>
                      <TableHead className="h-8 text-center py-1">On Time Rate</TableHead>
                      <TableHead className="h-8 text-center py-1">Effective Rate</TableHead>
                      <TableHead className="h-8 text-center py-1">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentManagers.map((manager) => (
                      <TableRow key={manager.name} className="hover:bg-gray-50/80">
                        <TableCell className="py-1 px-4 font-medium text-sm text-center">{manager.name}</TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">{manager.dailyTarget}</TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">{manager.monthlyTarget}</TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">
                          <div className="flex items-center justify-center gap-1">
                            <span>{manager.monthlyTargetAdjusted}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4"
                              onClick={() => handleEditTarget(manager)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="py-1 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={manager.progress} className="h-1.5" />
                            <span className="text-xs">{manager.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">{manager.onTimeRate}%</TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">{manager.effectiveRate}%</TableCell>
                        <TableCell className="py-1 px-4 text-center text-sm">{manager.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card className="w-full">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">{getTabTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm text-muted-foreground">
              This section will display content for the {activeTab} tab.
            </p>
          </CardContent>
        </Card>
      );
    }
  };

  const renderSecondaryTabContent = () => {
    switch (activeSubTab) {
      case "dashboard":
        return (
          <Card className="w-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Dashboard Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ContentPlan />
            </CardContent>
          </Card>
        );
      case "content":
        return (
          <Card className="w-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Content Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ContentTable />
            </CardContent>
          </Card>
        );
      case "create-content":
        return (
          <Card className="w-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Create Content</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Create New Content</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Create and publish new content for your social media channels. You can customize the workflow based on your requirements.
                </p>
                <Button variant="outline">Create Content</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="w-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">{activeSubTab} Content</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground">
                This section will display content for the {activeSubTab} tab.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 max-w-7xl">
      {/* Primary Tab Navigation */}
      <div className="bg-gray-50 rounded-md overflow-hidden border">
        <div className="grid grid-cols-3 w-full">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 text-center text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                activeTab === tab.id 
                  ? "bg-white text-gray-800 font-medium" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      {renderTabContent()}

      {/* Pagination - Make it more compact */}
      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="h-7 text-xs" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="h-7 text-xs" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Secondary Tab Navigation */}
      <div className="bg-gray-50 rounded-md overflow-hidden border">
        <div className="grid grid-cols-5 w-full">
          {secondaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-2 px-3 text-center text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                activeSubTab === tab.id 
                  ? "bg-white text-gray-800 font-medium" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.id === "dashboard" ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                  />
                </svg>
              ) : tab.id === "content" ? (
                <Package className="h-4 w-4" />
              ) : tab.id === "create-content" ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              ) : tab.id === "content-bank" ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      {renderSecondaryTabContent()}

      {/* New Section Added Inside Py-2 Div */}
      <div className="py-2">
        <Card className="w-full shadow-sm">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Content Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Content Production</h3>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-green-600 text-sm font-medium">+12% ↑</div>
                </div>
                <Progress value={87} className="h-1.5 mt-2" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Engagement Rate</h3>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">4.8%</div>
                  <div className="text-red-600 text-sm font-medium">-0.3% ↓</div>
                </div>
                <Progress value={48} className="h-1.5 mt-2" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-sm text-gray-700 mb-2">On-Time Delivery</h3>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-green-600 text-sm font-medium">+5% ↑</div>
                </div>
                <Progress value={92} className="h-1.5 mt-2" />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Recent Content Performance</h3>
              <Button variant="outline" size="sm" className="text-xs h-7">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Target Dialog */}
      <Dialog open={isEditTargetOpen} onOpenChange={setIsEditTargetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Target for {format(selectedMonth, "MMMM yyyy")}
            </DialogTitle>
            <button 
              onClick={() => setIsEditTargetOpen(false)} 
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="month" className="text-base font-medium">Month</label>
              <Select value={format(selectedMonth, "MMMM yyyy")}>
                <SelectTrigger className="w-full">
                  <SelectValue>{format(selectedMonth, "MMMM yyyy")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={`${month} ${selectedMonth.getFullYear()}`}>
                        {month} {selectedMonth.getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="target" className="text-base font-medium">Target Value</label>
              <Input 
                id="target" 
                type="number" 
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditTargetOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white" 
              onClick={handleSaveTarget}
            >
              Save Target
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMediaManagement;

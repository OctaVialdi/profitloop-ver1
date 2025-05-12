import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { PrimaryTabNavigation } from "@/components/marketing/social-media/PrimaryTabNavigation";
import { SecondaryTabNavigation } from "@/components/marketing/social-media/SecondaryTabNavigation";
import { TargetQuantityTable } from "@/components/marketing/social-media/TargetQuantityTable";
import { EditTargetDialog } from "@/components/marketing/social-media/EditTargetDialog";
import { useTargetManagement } from "@/hooks/useTargetManagement";
import { format } from "date-fns";

interface TabData {
  id: string;
  label: string;
  path: string;
}

const SocialMediaManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("content-planner");
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard");
  
  // Import all state and handlers from the custom hook
  const {
    selectedDate,
    selectedMonth,
    isCalendarOpen,
    isMonthSelectorOpen,
    isEditTargetOpen,
    editingManager,
    targetValue,
    contentManagers,
    setSelectedDate,
    setSelectedMonth,
    setIsCalendarOpen,
    setIsMonthSelectorOpen,
    setIsEditTargetOpen,
    setTargetValue,
    handleEditTarget,
    handleSaveTarget,
    renderMonthCalendar
  } = useTargetManagement();

  // New states for PIC, Services, and SubServices data from localStorage
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  
  const primaryTabs: TabData[] = [
    { id: "content-planner", label: "Content Planner", path: "" },
    { id: "production", label: "Production", path: "" },
    { id: "content-post", label: "Content Post", path: "" }
  ];

  const secondaryTabs: TabData[] = [
    { id: "dashboard", label: "Dashboard", path: "/marketing/social-media" },
    { id: "content-bank", label: "Content Bank", path: "/marketing/social-media/content-bank" },
    { id: "content-qc", label: "Content QC", path: "/marketing/social-media/content-qc" }
  ];

  // Load the content planners (employees with jobPosition "Content Planner")
  useEffect(() => {
    // Load data from localStorage
    const storedEmployeesJson = localStorage.getItem('employees');
    if (storedEmployeesJson) {
      try {
        const allEmployees = JSON.parse(storedEmployeesJson);
        // Filter for Digital Marketing employees with Content Planner position
        const planners = allEmployees.filter(
          (emp: any) => emp.organization === "Digital Marketing" && 
                        emp.jobPosition === "Content Planner"
        );
        setContentPlanners(planners);
      } catch (e) {
        console.error("Error parsing employees from localStorage:", e);
      }
    }
  }, []);

  // Load services and subServices from localStorage
  useEffect(() => {
    const storedServices = localStorage.getItem("marketingServices");
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error("Error parsing services from localStorage:", e);
      }
    }

    const storedSubServices = localStorage.getItem("marketingSubServices");
    if (storedSubServices) {
      try {
        setSubServices(JSON.parse(storedSubServices));
      } catch (e) {
        console.error("Error parsing sub-services from localStorage:", e);
      }
    }
  }, []);

  // Detect current path and set active tab accordingly
  useEffect(() => {
    const path = location.pathname;
    
    // Set activeSubTab based on current path
    const currentSubTab = secondaryTabs.find(tab => tab.path === path);
    if (currentSubTab) {
      setActiveSubTab(currentSubTab.id);
    } else if (path === "/marketing/social-media") {
      setActiveSubTab("dashboard");
    }
  }, [location.pathname]);

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

  // Get subservices for a specific service
  const getSubServicesForService = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-4">
      {/* Primary Tab Navigation */}
      <PrimaryTabNavigation 
        tabs={primaryTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content Section */}
      <Card className="w-full border shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg">{getTabTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TargetQuantityTable 
            contentManagers={contentManagers}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            isCalendarOpen={isCalendarOpen}
            isMonthSelectorOpen={isMonthSelectorOpen}
            setIsCalendarOpen={setIsCalendarOpen}
            setIsMonthSelectorOpen={setIsMonthSelectorOpen}
            handleEditTarget={handleEditTarget}
            setSelectedDate={setSelectedDate}
            setSelectedMonth={setSelectedMonth}
            renderMonthCalendar={renderMonthCalendar}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
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
      <SecondaryTabNavigation 
        tabs={secondaryTabs}
        activeTab={activeSubTab}
      />

      {/* Content for the active tab */}
      <Outlet />

      {/* Edit Target Dialog */}
      <EditTargetDialog 
        isEditTargetOpen={isEditTargetOpen}
        setIsEditTargetOpen={setIsEditTargetOpen}
        editingManager={editingManager}
        targetValue={targetValue}
        setTargetValue={setTargetValue}
        handleSaveTarget={handleSaveTarget}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default SocialMediaManagement;

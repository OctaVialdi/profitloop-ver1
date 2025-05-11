
import { useState, useEffect, useMemo } from "react";
import { 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Edit, X } from "lucide-react";
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
import { useNavigate, useLocation, Outlet } from "react-router-dom";

interface TabData {
  id: string;
  label: string;
  path: string;
}

const SocialMediaManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  
  // New states for PIC, Services, and SubServices data from localStorage
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  
  const secondaryTabs: TabData[] = [
    { id: "dashboard", label: "Dashboard", path: "/marketing/social-media" },
    { id: "create-content", label: "Create Content", path: "/marketing/social-media/create-content" },
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

  const handleTabClick = (tabId: string, path: string) => {
    navigate(path);
    setActiveSubTab(tabId);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-4">
      {/* Secondary Tab Navigation */}
      <div className="bg-gray-50 rounded-md overflow-hidden border">
        <div className="grid grid-cols-4 w-full">
          {secondaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.path)}
              className={`py-2 px-3 text-center text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                activeSubTab === tab.id 
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
                {tab.id === "dashboard" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                  />
                ) : tab.id === "create-content" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 4v16m8-8H4" 
                  />
                ) : tab.id === "content-bank" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                )}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content for the active tab */}
      <Outlet />

    </div>
  );
};

export default SocialMediaManagement;

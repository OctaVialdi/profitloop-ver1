
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { ContentTabsTable } from "@/components/marketing/social-media/ContentTabsTable";
import { useContentManagement } from "@/hooks/useContentManagement";
import { format } from "date-fns";

export interface ContentPillar {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  name: string;
  serviceId: string; // Reference to parent service
}

export interface Service {
  id: string;
  name: string;
}

const ContentPlan = () => {
  const {
    contentTypes,
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  } = useContentManagement();
  
  // Local state for the ContentPlan component
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [isUserManager, setIsUserManager] = useState(false);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentItemForBrief, setCurrentItemForBrief] = useState<string | null>(null);
  const [briefContent, setBriefContent] = useState<string>('');
  const [briefEditMode, setBriefEditMode] = useState<'edit' | 'view'>('view');

  // Load services, subServices, contentPillars from localStorage
  useEffect(() => {
    const storedServices = localStorage.getItem("marketingServices");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Initialize with some default services if none exist
      const defaultServices = [
        { id: "1", name: "Social Media Management" },
        { id: "2", name: "SEO" },
        { id: "3", name: "Content Marketing" }
      ];
      localStorage.setItem("marketingServices", JSON.stringify(defaultServices));
      setServices(defaultServices);
    }
    
    const storedSubServices = localStorage.getItem("marketingSubServices");
    if (storedSubServices) {
      setSubServices(JSON.parse(storedSubServices));
    } else {
      // Initialize with some default sub-services if none exist
      const defaultSubServices = [
        { id: "1", name: "Instagram Management", serviceId: "1" },
        { id: "2", name: "Facebook Management", serviceId: "1" },
        { id: "3", name: "LinkedIn Management", serviceId: "1" },
        { id: "4", name: "On-Page SEO", serviceId: "2" },
        { id: "5", name: "Off-Page SEO", serviceId: "2" },
        { id: "6", name: "Blog Writing", serviceId: "3" },
        { id: "7", name: "Copywriting", serviceId: "3" }
      ];
      localStorage.setItem("marketingSubServices", JSON.stringify(defaultSubServices));
      setSubServices(defaultSubServices);
    }
    
    const storedPillars = localStorage.getItem("marketingContentPillars");
    if (storedPillars) {
      setContentPillars(JSON.parse(storedPillars));
    } else {
      // Initialize with some default content pillars if none exist
      const defaultPillars = [
        { id: "1", name: "Education" },
        { id: "2", name: "Engagement" },
        { id: "3", name: "Entertainment" },
        { id: "4", name: "Promotion" }
      ];
      localStorage.setItem("marketingContentPillars", JSON.stringify(defaultPillars));
      setContentPillars(defaultPillars);
    }

    // Load content planners (employees with jobPosition "Content Planner")
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
        
        // Check if current user is a manager
        const isManager = allEmployees.some(
          (emp: any) => emp.organization === "Digital Marketing" && 
                        emp.jobPosition?.toLowerCase().includes("manager") &&
                        emp.isCurrentUser
        );
        setIsUserManager(isManager);
      } catch (e) {
        console.error("Error parsing employees from localStorage:", e);
      }
    }
  }, []);

  // Handler to toggle calendar for date selection
  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handler for date change
  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: format(date, 'yyyy-MM-dd') });
      toggleCalendar(itemId);
    }
  };

  // Handler for content type change
  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  // Handler for PIC change
  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  // Handler for service change
  const handleServiceChange = (itemId: string, serviceId: string) => {
    // When service changes, we clear the subService since it might not be compatible
    updateContentItem(itemId, { service: serviceId, subService: "" });
  };

  // Handler for sub-service change
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handler for title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Handler for content pillar change
  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  // Handler to toggle item selection
  const handleToggleSelectItem = (itemId: string) => {
    toggleSelectItem(itemId);
  };

  // Handler to select/deselect all items
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  // Handler to delete selected items
  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length > 0) {
      deleteContentItems(selectedIds);
      setSelectAll(false);
    }
  };

  // Get filtered sub-services based on selected service
  const getFilteredSubServicesByServiceId = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };

  // Handler for status change
  const handleStatusChange = (itemId: string, status: string) => {
    const item = contentItems.find(item => item.id === itemId);
    const updatedItem: any = { status };
    
    // If changing to "Butuh Di Review", add completion date
    if (status === "review") {
      updatedItem.completionDate = new Date().toISOString();
    }
    
    // If changing to "Request Revisi", increment revision counter
    if (status === "revisi" && item?.status !== "revisi") {
      updatedItem.revisionCount = (item?.revisionCount || 0) + 1;
    }
    
    updateContentItem(itemId, updatedItem);
  };

  // Reset revision counter
  const resetRevisionCounter = (itemId: string) => {
    updateContentItem(itemId, { revisionCount: 0 });
  };

  // Toggle approved status
  const toggleApproved = (itemId: string, isApproved: boolean) => {
    updateContentItem(itemId, { isApproved });
  };

  // Handle brief dialog
  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemForBrief(itemId);
    setBriefContent(brief);
    setBriefEditMode(mode);
    setIsBriefDialogOpen(true);
  };

  // Extract Google Docs link from brief text
  const extractGoogleDocsLink = (text: string) => {
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/\S+)/g;
    const match = text.match(googleDocsRegex);
    return match ? match[0] : null;
  };

  // Display brief with truncation
  const displayBrief = (brief: string) => {
    if (!brief) return "Click to add brief";
    return brief.length > 25 ? brief.substring(0, 25) + "..." : brief;
  };

  // Add new content item row
  const handleAddRow = () => {
    addContentItem();
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Plan</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={!contentItems.some(item => item.isSelected)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ContentTabsTable
          contentItems={contentItems}
          contentTypes={contentTypes}
          services={services}
          subServices={subServices}
          contentPlanners={contentPlanners}
          contentPillars={contentPillars}
          isCalendarOpen={isCalendarOpen}
          isUserManager={isUserManager}
          toggleCalendar={toggleCalendar}
          handleDateChange={handleDateChange}
          handleTypeChange={handleTypeChange}
          handlePICChange={handlePICChange}
          handleServiceChange={handleServiceChange}
          handleSubServiceChange={handleSubServiceChange}
          handleTitleChange={handleTitleChange}
          handleContentPillarChange={handleContentPillarChange}
          handleStatusChange={handleStatusChange}
          toggleSelectItem={handleToggleSelectItem}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          openBriefDialog={openBriefDialog}
          getFilteredSubServicesByServiceId={getFilteredSubServicesByServiceId}
          extractGoogleDocsLink={extractGoogleDocsLink}
          displayBrief={displayBrief}
          resetRevisionCounter={resetRevisionCounter}
          toggleApproved={toggleApproved}
        />
      </CardContent>
    </Card>
  );
};

export default ContentPlan;

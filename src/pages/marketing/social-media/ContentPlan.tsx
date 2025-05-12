
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { ContentTable } from "@/components/marketing/social-media/ContentTable";
import { useContentManagement } from "@/hooks/useContentManagement";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";
import { toast } from "sonner";

const ContentPlan = () => {
  const { 
    contentTypes, 
    services, 
    subServices,
    contentItems, 
    contentPlanners,
    contentPillars,
    addContentItem, 
    updateContentItem, 
    deleteContentItems,
    resetRevisionCounter,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices
  } = useContentManagement();

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState("");
  const [currentBrief, setCurrentBrief] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");
  const [isUserManager, setIsUserManager] = useState(false);

  // Set up manager role check
  useEffect(() => {
    // This is a placeholder. In a real app, you would check the user role
    // from your authentication system
    setIsUserManager(true);
  }, []);

  const handleAddRow = () => {
    addContentItem();
  };

  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length === 0) {
      toast.warning("No items selected");
      return;
    }

    deleteContentItems(selectedIds);
    toast.success(`Deleted ${selectedIds.length} items`);
  };

  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleDateChange = (itemId: string, date: Date | undefined) => {
    updateContentItem(itemId, { 
      postDate: date ? date.toISOString().split('T')[0] : undefined 
    });
    toggleCalendar(itemId);
  };

  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  const handleServiceChange = (itemId: string, serviceId: string) => {
    // When service changes, reset subService
    updateContentItem(itemId, { 
      service: serviceId,
      subService: "none" 
    });
  };

  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  const handleStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { status });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setBriefDialogOpen(true);
  };

  const saveBrief = (brief: string) => {
    if (currentItemId) {
      updateContentItem(currentItemId, { brief, status: "none" });
      setBriefDialogOpen(false);
      toast.success("Brief saved successfully");
    }
  };

  const getFilteredSubServicesByServiceId = (serviceId: string) => {
    return getFilteredSubServices(serviceId);
  };

  const extractGoogleDocsLink = (text: string): string | null => {
    const regex = /(https:\/\/docs\.google\.com\/\S+)/;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  const displayBrief = (brief: string): string => {
    // Truncate brief for display
    return brief.length > 25 ? `${brief.substring(0, 22)}...` : brief;
  };

  const toggleApproved = (itemId: string, isApproved: boolean) => {
    updateContentItem(itemId, { isApproved });
  };

  // Define all columns for the horizontal scrollable table
  const allColumns = [
    "selectColumn", "postDate", "contentType", "pic", "service", "subService", "title", 
    "contentPillar", "brief", "status", "revision", "approved", "completionDate", 
    "mirrorPostDate", "mirrorContentType", "mirrorTitle", "picProduction", 
    "googleDriveLink", "productionStatus", "productionRevision", "productionCompletionDate", 
    "productionApproved", "productionApprovedDate", "downloadLink", "postLink", 
    "isDone", "actualPostDate", "onTimeStatus", "contentStatus"
  ];

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Plan</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteSelected} 
            className="flex items-center"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button 
            onClick={handleAddRow} 
            className="flex items-center"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ContentTable 
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
            toggleSelectItem={toggleSelectItem}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            openBriefDialog={openBriefDialog}
            getFilteredSubServicesByServiceId={getFilteredSubServicesByServiceId}
            extractGoogleDocsLink={extractGoogleDocsLink}
            displayBrief={displayBrief}
            resetRevisionCounter={resetRevisionCounter}
            toggleApproved={toggleApproved}
            updateContentItem={updateContentItem}
            visibleColumns={allColumns}
          />
        </div>
      </CardContent>

      <BriefDialog 
        open={briefDialogOpen} 
        onOpenChange={setBriefDialogOpen}
        brief={currentBrief}
        mode={briefDialogMode}
        onSave={saveBrief}
      />
    </Card>
  );
};

export default ContentPlan;

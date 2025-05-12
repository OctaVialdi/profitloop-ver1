
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useContentManagement } from "@/hooks/useContentManagement";
import { format } from "date-fns";
import { useContentBrief } from "@/hooks/useContentBrief";
import { ContentTable } from "@/components/marketing/social-media/ContentTable";
import { ContentHeader } from "@/components/marketing/social-media/ContentHeader";
import { ContentFooter } from "@/components/marketing/social-media/ContentFooter";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";

const CreateContent = () => {
  const {
    contentTypes,
    services,
    subServices,
    contentItems,
    contentPlanners,
    contentPillars,
    addContentItem,
    updateContentItem,
    resetRevisionCounter,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  
  // Simulate a user role check - in a real app, this would come from authentication
  const [isUserManager, setIsUserManager] = useState(true);
  
  // Simulate loading user role from localStorage
  useEffect(() => {
    // In a real application, you would get this from your auth system
    // For now, we'll hardcode it to true for testing purposes
    const savedUserRole = localStorage.getItem("userRole");
    setIsUserManager(savedUserRole === "manager" || true); // Default to true for testing
  }, []);
  
  const {
    isBriefDialogOpen,
    setIsBriefDialogOpen,
    currentBrief,
    setCurrentBrief,
    currentItemId,
    briefDialogMode,
    setBriefDialogMode,
    extractGoogleDocsLink,
    displayBrief,
    openBriefDialog,
    saveBrief
  } = useContentBrief(updateContentItem);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  const handleAddRow = () => {
    addContentItem();
    toast.success("New content row added");
  };

  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: format(date, 'yyyy-MM-dd') });
      
      // Close the calendar popover
      setIsCalendarOpen(prev => ({
        ...prev,
        [itemId]: false
      }));
    }
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
      subService: ""  
    });
  };
  
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  const handleTitleChange = (itemId: string, title: string) => {
    // Limit to 25 characters
    const trimmedTitle = title.slice(0, 25);
    updateContentItem(itemId, { title: trimmedTitle });
  };

  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  const handleStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { status });
  };

  // Removed handleApprovalChange function since it's no longer needed

  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length === 0) {
      toast.error("No items selected for deletion");
      return;
    }
    
    deleteContentItems(selectedIds);
    setSelectAll(false);
    toast.success(`${selectedIds.length} items deleted`);
  };

  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Get filtered sub-services based on selected service
  const getFilteredSubServicesByServiceId = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };
  
  const hasSelectedItems = contentItems.some(item => item.isSelected);
  const selectedItemsCount = contentItems.filter(item => item.isSelected).length;

  return (
    <Card className="w-full h-full overflow-hidden">
      <ContentHeader 
        handleDeleteSelected={handleDeleteSelected}
        handleAddRow={handleAddRow}
        hasSelectedItems={hasSelectedItems}
      />
      
      <CardContent className="p-0 overflow-hidden">
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
        />
      </CardContent>
      
      <ContentFooter 
        totalItems={contentItems.length}
        selectedItemsCount={selectedItemsCount}
      />

      <BriefDialog
        isOpen={isBriefDialogOpen}
        onOpenChange={setIsBriefDialogOpen}
        currentBrief={currentBrief}
        setCurrentBrief={setCurrentBrief}
        mode={briefDialogMode}
        setMode={setBriefDialogMode}
        saveBrief={saveBrief}
        extractGoogleDocsLink={extractGoogleDocsLink}
      />
    </Card>
  );
};

export default CreateContent;

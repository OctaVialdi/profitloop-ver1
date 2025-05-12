
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentTabsTable } from "@/components/marketing/social-media/ContentTabsTable";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useToast } from "@/hooks/use-toast";

const ContentPlan = () => {
  const { toast } = useToast();
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

  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("view");
  
  // Check if any items are selected
  const hasSelectedItems = contentItems.some(item => item.isSelected);
  
  // Check if all items are selected
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);

  // Toggle calendar for a specific item
  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle date change for a specific item
  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: date.toISOString().split('T')[0] });
    }
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: false
    }));
  };

  // Handle content type change
  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  // Handle PIC change
  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  // Handle service change
  const handleServiceChange = (itemId: string, serviceId: string) => {
    const updatedItem: any = { service: serviceId };
    
    // Clear sub-service when changing service
    updatedItem.subService = "";
    
    updateContentItem(itemId, updatedItem);
  };

  // Handle sub-service change
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handle title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Handle content pillar change
  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { status });
  };

  // Handle approved status toggle
  const toggleApproved = (itemId: string, isApproved: boolean) => {
    updateContentItem(itemId, { isApproved });
  };

  // Open brief dialog
  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  // Save brief
  const saveBrief = () => {
    updateContentItem(currentItemId, { brief: currentBrief });
    setIsBriefDialogOpen(false);
    toast({
      title: "Brief saved",
      description: "The content brief has been updated"
    });
  };

  // Function to extract Google Docs link from brief text
  const extractGoogleDocsLink = (text: string): string | null => {
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+)/i;
    const match = text.match(googleDocsRegex);
    return match ? match[1] : null;
  };

  // Function to display brief (truncated)
  const displayBrief = (brief: string): string => {
    const maxLength = 20;
    if (brief.length <= maxLength) return brief;
    return brief.substring(0, maxLength) + '...';
  };

  // Handle select/deselect all items
  const handleSelectAll = (checked: boolean) => {
    selectAllItems(checked);
  };

  // Handle delete selected items
  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
      
    if (selectedIds.length === 0) return;
    
    deleteContentItems(selectedIds);
    toast({
      title: `${selectedIds.length} item(s) deleted`,
      description: "The selected content items have been removed"
    });
  };

  // Check if the current user is a manager (for demo, set to true)
  const isUserManager = true;

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Plan</CardTitle>
        <div className="flex space-x-2">
          {hasSelectedItems && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          )}
          <Button 
            onClick={addContentItem} 
            size="sm" 
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
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
            toggleSelectItem={toggleSelectItem}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            openBriefDialog={openBriefDialog}
            getFilteredSubServicesByServiceId={getFilteredSubServices}
            extractGoogleDocsLink={extractGoogleDocsLink}
            displayBrief={displayBrief}
            resetRevisionCounter={resetRevisionCounter}
            toggleApproved={toggleApproved}
          />
        </div>
      </CardContent>

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

export default ContentPlan;

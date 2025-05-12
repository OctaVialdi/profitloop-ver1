
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useContentBrief } from "@/hooks/useContentBrief";
import { useToast } from "@/hooks/use-toast";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";
import { ContentPlanHeader } from "@/components/marketing/social-media/ContentPlanHeader";
import { ContentPlanTable } from "@/components/marketing/social-media/ContentPlanTable";
import { TitleDialog } from "@/components/marketing/social-media/dialogs/TitleDialog";
import { LinkDialog } from "@/components/marketing/social-media/dialogs/LinkDialog";
import { format } from "date-fns";

const ContentPlan = () => {
  const { toast } = useToast();
  const {
    contentTypes,
    services,
    subServices,
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    contentPlanners,
    productionTeam,
    contentPillars,
    getFilteredSubServices,
    resetRevisionCounter,
    resetProductionRevisionCounter,
    calculateOnTimeStatus,
    extractGoogleDocsLink,
    displayBrief
  } = useContentManagement();

  // Initialize the useContentBrief hook
  const {
    isBriefDialogOpen,
    setIsBriefDialogOpen,
    currentBrief,
    setCurrentBrief,
    currentItemId,
    briefDialogMode,
    setBriefDialogMode,
    openBriefDialog,
    saveBrief
  } = useContentBrief(updateContentItem);

  // State for calendar popovers
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  
  // State for title dialog
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState("");
  
  // State for link dialogs
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [linkDialogType, setLinkDialogType] = useState<"googleDrive" | "postLink">("googleDrive");
  
  // Check if any items are selected
  const hasSelectedItems = contentItems.some(item => item.isSelected);

  // Toggle calendar for a specific item
  const toggleCalendar = (itemId: string, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => {
    const key = `${itemId}-${type}`;
    setIsCalendarOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle date change for a specific item
  const handleDateChange = (itemId: string, date: Date | undefined, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => {
    if (date) {
      updateContentItem(itemId, { [type]: date.toISOString() });
      
      // Update onTimeStatus if actualPostDate changes
      if (type === 'actualPostDate') {
        const item = contentItems.find(i => i.id === itemId);
        if (item) {
          const onTimeStatus = calculateOnTimeStatus(item.postDate, date.toISOString());
          updateContentItem(itemId, { onTimeStatus });
        }
      }
    }
    const key = `${itemId}-${type}`;
    setIsCalendarOpen(prev => ({
      ...prev,
      [key]: false
    }));
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

  // Handle content type change
  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  // Handle PIC change
  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };
  
  // Handle PIC Production change
  const handlePICProductionChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { picProduction: picName });
  };

  // Handle service change
  const handleServiceChange = (itemId: string, serviceId: string) => {
    // When service changes, we need to reset the subService
    updateContentItem(itemId, { service: serviceId, subService: "" });
  };
  
  // Handle subService change
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handle content pillar change
  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  // Handle title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Open title dialog for editing
  const openTitleDialog = (itemId: string, currentTitle: string) => {
    setEditingItemId(itemId);
    setCurrentTitle(currentTitle);
    setTitleDialogOpen(true);
  };
  
  // Open link dialog for editing
  const openLinkDialog = (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => {
    setEditingItemId(itemId);
    setCurrentLink(currentValue);
    setLinkDialogType(type);
    setLinkDialogOpen(true);
  };
  
  // Save link from dialog
  const saveLinkDialog = () => {
    if (linkDialogType === "googleDrive") {
      updateContentItem(editingItemId, { 
        googleDriveLink: currentLink,
        // Reset production status if google drive link changes
        productionStatus: "none"  
      });
    } else {
      const now = new Date();
      updateContentItem(editingItemId, { 
        postLink: currentLink,
        // Set actual post date when link is added
        actualPostDate: currentLink ? now.toISOString() : undefined 
      });
      
      // Calculate on-time status
      const item = contentItems.find(i => i.id === editingItemId);
      if (item && item.postDate && currentLink) {
        const onTimeStatus = calculateOnTimeStatus(item.postDate, now.toISOString());
        updateContentItem(editingItemId, { onTimeStatus });
      }
    }
    setLinkDialogOpen(false);
    setEditingItemId("");
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    const updates: Partial<typeof contentItems[0]> = { status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.completionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      const item = contentItems.find(item => item.id === itemId);
      if (item) {
        updates.revisionCount = (item.revisionCount || 0) + 1;
      }
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle production status change
  const handleProductionStatusChange = (itemId: string, status: string) => {
    const updates: Partial<typeof contentItems[0]> = { productionStatus: status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.productionCompletionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      const item = contentItems.find(item => item.id === itemId);
      if (item) {
        updates.productionRevisionCount = (item.productionRevisionCount || 0) + 1;
      }
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle content status change
  const handleContentStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { contentStatus: status });
  };

  // Handle brief change and status update
  useEffect(() => {
    const handleBriefChange = (prevItems: typeof contentItems, currentItems: typeof contentItems) => {
      currentItems.forEach(currentItem => {
        const prevItem = prevItems.find(item => item.id === currentItem.id);
        if (prevItem && prevItem.brief !== currentItem.brief && currentItem.brief) {
          // Brief changed, reset status
          updateContentItem(currentItem.id, { status: "none" });
        }
        
        // Check for Google Drive link change
        if (prevItem && prevItem.googleDriveLink !== currentItem.googleDriveLink && currentItem.googleDriveLink) {
          // Google Drive link changed, reset production status
          updateContentItem(currentItem.id, { productionStatus: "none" });
        }
      });
    };

    // Track previous items
    const prevItemsJSON = localStorage.getItem("prevContentItems");
    if (prevItemsJSON) {
      const prevItems = JSON.parse(prevItemsJSON);
      handleBriefChange(prevItems, contentItems);
    }
    
    // Save current items for next comparison
    localStorage.setItem("prevContentItems", JSON.stringify(contentItems));
  }, [contentItems]);
  
  // Handle approval changes and set approval date
  const handleApprovalChange = (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => {
    const now = new Date();
    const updates: Partial<typeof contentItems[0]> = { 
      [field]: isApproved 
    };
    
    // Set the approval date if approving production
    if (field === "productionApproved" && isApproved) {
      updates.productionApprovedDate = now.toISOString();
    } else if (field === "productionApproved" && !isApproved) {
      updates.productionApprovedDate = undefined;
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle done status change
  const handleDoneStatusChange = (itemId: string, isDone: boolean) => {
    updateContentItem(itemId, { isDone });
  };

  // Save title from dialog
  const saveTitleDialog = () => {
    if (editingItemId) {
      updateContentItem(editingItemId, { title: currentTitle });
      setTitleDialogOpen(false);
      setEditingItemId("");
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string | undefined, includeTime: boolean = true) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return includeTime 
        ? format(date, "dd MMM yyyy - HH:mm")
        : format(date, "dd MMM yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <ContentPlanHeader
        hasSelectedItems={hasSelectedItems}
        handleDeleteSelected={handleDeleteSelected}
        addContentItem={addContentItem}
      />
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <ContentPlanTable
            contentItems={contentItems}
            contentTypes={contentTypes}
            services={services}
            subServices={subServices}
            contentPlanners={contentPlanners}
            contentPillars={contentPillars}
            productionTeam={productionTeam}
            isCalendarOpen={isCalendarOpen}
            toggleCalendar={toggleCalendar}
            handleDateChange={handleDateChange}
            handleTypeChange={handleTypeChange}
            handlePICChange={handlePICChange}
            handlePICProductionChange={handlePICProductionChange}
            handleServiceChange={handleServiceChange}
            handleSubServiceChange={handleSubServiceChange}
            handleTitleChange={handleTitleChange}
            handleContentPillarChange={handleContentPillarChange}
            handleStatusChange={handleStatusChange}
            handleProductionStatusChange={handleProductionStatusChange}
            handleContentStatusChange={handleContentStatusChange}
            toggleSelectItem={toggleSelectItem}
            selectAllItems={selectAllItems}
            openBriefDialog={openBriefDialog}
            getFilteredSubServices={getFilteredSubServices}
            extractGoogleDocsLink={extractGoogleDocsLink}
            displayBrief={displayBrief}
            resetRevisionCounter={resetRevisionCounter}
            resetProductionRevisionCounter={resetProductionRevisionCounter}
            handleApprovalChange={handleApprovalChange}
            handleDoneStatusChange={handleDoneStatusChange}
            openTitleDialog={openTitleDialog}
            openLinkDialog={openLinkDialog}
            formatDisplayDate={formatDisplayDate}
          />
        </div>
      </CardContent>

      {/* Dialog for full title editing */}
      <TitleDialog
        open={titleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        currentTitle={currentTitle}
        setCurrentTitle={setCurrentTitle}
        saveTitle={saveTitleDialog}
      />
      
      {/* Dialog for link editing */}
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        title={linkDialogType === "googleDrive" ? "Add Google Drive Link" : "Add Post Link"}
        value={currentLink}
        onChange={setCurrentLink}
        onSave={saveLinkDialog}
        placeholder={linkDialogType === "googleDrive" ? "Enter Google Drive link" : "Enter post link"}
        inputType="url"
      />

      {/* Brief Dialog Component */}
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

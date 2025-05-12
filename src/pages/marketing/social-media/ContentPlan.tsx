
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useContentBrief } from "@/hooks/useContentBrief";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BriefDialog } from "@/components/marketing/social-media/BriefDialog";
import { ContentTabsTable } from "@/components/marketing/social-media/ContentTabsTable";
import { format } from "date-fns";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
  inputType?: "text" | "url";
}

const InputDialog: React.FC<InputDialogProps> = ({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  onSave,
  placeholder = "Enter value",
  inputType = "text"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <input
              type={inputType}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
    handleStatusChange: statusChange,
    handleProductionStatusChange: productionStatusChange,
    handleContentStatusChange: contentStatusChange,
    toggleApproval
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
    extractGoogleDocsLink,
    displayBrief,
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
  
  // Select all checkbox state
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);
  
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

  // Handle status changes
  const handleStatusChange = (itemId: string, status: string) => {
    statusChange(itemId, status);
  };
  
  const handleProductionStatusChange = (itemId: string, status: string) => {
    productionStatusChange(itemId, status);
  };
  
  const handleContentStatusChange = (itemId: string, status: string) => {
    contentStatusChange(itemId, status);
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
  }, [contentItems, updateContentItem]);
  
  // Handle done status change
  const handleDoneStatusChange = (itemId: string, isDone: boolean) => {
    updateContentItem(itemId, { isDone });
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
        <div className="border rounded-md overflow-hidden">
          <ScrollArea className="h-[calc(100vh-230px)]">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px] max-w-[1300px] w-full">
                <ContentTabsTable
                  contentItems={contentItems}
                  contentTypes={contentTypes}
                  services={services}
                  subServices={subServices}
                  contentPlanners={contentPlanners}
                  contentPillars={contentPillars}
                  productionTeam={productionTeam}
                  isCalendarOpen={isCalendarOpen}
                  isUserManager={true}
                  toggleCalendar={toggleCalendar}
                  handleDateChange={handleDateChange}
                  handleTypeChange={handleTypeChange}
                  handlePICChange={handlePICChange}
                  handleServiceChange={handleServiceChange}
                  handleSubServiceChange={handleSubServiceChange}
                  handleTitleChange={handleTitleChange}
                  handleContentPillarChange={handleContentPillarChange}
                  handleStatusChange={handleStatusChange}
                  handleProductionStatusChange={handleProductionStatusChange}
                  handleContentStatusChange={handleContentStatusChange}
                  toggleSelectItem={toggleSelectItem}
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                  openBriefDialog={openBriefDialog}
                  getFilteredSubServicesByServiceId={getFilteredSubServices}
                  extractGoogleDocsLink={extractGoogleDocsLink}
                  displayBrief={displayBrief}
                  resetRevisionCounter={resetRevisionCounter}
                  resetProductionRevisionCounter={resetProductionRevisionCounter}
                  toggleApproved={toggleApproval}
                  openTitleDialog={openTitleDialog}
                  openLinkDialog={openLinkDialog}
                  handlePICProductionChange={handlePICProductionChange}
                  handleDoneStatusChange={handleDoneStatusChange}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Dialog for full title editing */}
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Content Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <input
                id="title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Enter complete title"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" onClick={() => {
                if (editingItemId) {
                  updateContentItem(editingItemId, { title: currentTitle });
                  setTitleDialogOpen(false);
                  setEditingItemId("");
                }
              }}>Save Title</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for link editing */}
      <InputDialog
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

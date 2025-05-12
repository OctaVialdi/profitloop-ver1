
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { ContentTable } from "@/components/marketing/social-media/ContentTable";
import { useContentManagement } from "@/hooks/useContentManagement";
import { format } from "date-fns";
import { useEmployees } from "@/hooks/useEmployees";

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
    toggleSelectItem,
    selectAllItems,
    resetRevisionCounter,
    getFilteredSubServices
  } = useContentManagement();

  const { employees } = useEmployees();
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");
  const [selectAll, setSelectAll] = useState(false);

  // Check if the current user is a manager
  const isUserManager = employees.some(employee => 
    employee.organization === "Digital Marketing" && 
    employee.jobPosition?.toLowerCase().includes("manager")
  );

  // Toggle the date picker calendar for a specific item
  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle date change for an item
  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { 
        postDate: format(date, "yyyy-MM-dd") 
      });
      toggleCalendar(itemId);
    }
  };

  // Handle content type selection
  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  // Handle PIC selection
  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  // Handle service selection
  const handleServiceChange = (itemId: string, serviceId: string) => {
    // Reset sub-service when service changes
    updateContentItem(itemId, { 
      service: serviceId,
      subService: "" 
    });
  };

  // Handle sub-service selection
  const handleSubServiceChange = (itemId: string, subServiceId: string) => {
    updateContentItem(itemId, { subService: subServiceId });
  };

  // Handle content title change
  const handleTitleChange = (itemId: string, title: string) => {
    updateContentItem(itemId, { title });
  };

  // Handle content pillar selection
  const handleContentPillarChange = (itemId: string, pillarId: string) => {
    updateContentItem(itemId, { contentPillar: pillarId });
  };

  // Open brief dialog for editing or viewing
  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  // Save brief changes
  const saveBrief = () => {
    if (currentItemId) {
      updateContentItem(currentItemId, { brief: currentBrief });
      setIsBriefDialogOpen(false);
    }
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { status });
  };

  // Handle approval status change
  const handleApprovalChange = (itemId: string, isApproved: boolean) => {
    updateContentItem(itemId, { isApproved });
  };

  // Handle select all toggle
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length > 0) {
      deleteContentItems(selectedIds);
      setSelectAll(false);
    }
  };

  // Extract Google Docs link from text if present
  const extractGoogleDocsLink = (text: string): string | null => {
    const regex = /(https:\/\/docs\.google\.com\/\S+)/i;
    const match = text.match(regex);
    return match ? match[0] : null;
  };

  // Format brief for display
  const displayBrief = (brief: string): string => {
    if (brief.length <= 25) return brief;
    return brief.substring(0, 22) + "...";
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
          <CardTitle className="text-xl font-bold">Content Plan</CardTitle>
          <div className="flex items-center gap-2">
            {isUserManager && contentItems.some(item => item.isSelected) && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={deleteSelectedItems}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            )}
            <Button 
              onClick={addContentItem}
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Row
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="w-full h-full">
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
              handleApprovalChange={handleApprovalChange}
              toggleSelectItem={toggleSelectItem}
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
              openBriefDialog={openBriefDialog}
              getFilteredSubServicesByServiceId={getFilteredSubServices}
              extractGoogleDocsLink={extractGoogleDocsLink}
              displayBrief={displayBrief}
              resetRevisionCounter={resetRevisionCounter}
            />
          </div>
        </CardContent>
      </Card>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {briefDialogMode === "edit" ? "Edit Content Brief" : "View Content Brief"}
            </DialogTitle>
            <DialogDescription>
              {briefDialogMode === "edit" 
                ? "Enter the content brief details below. You can paste Google Docs links for external content."
                : "Content brief details and references."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {briefDialogMode === "edit" ? (
              <Textarea
                value={currentBrief}
                onChange={(e) => setCurrentBrief(e.target.value)}
                placeholder="Enter content brief or paste Google Docs link"
                className="min-h-[150px]"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                <p className="whitespace-pre-wrap">{currentBrief}</p>
                {extractGoogleDocsLink(currentBrief) && (
                  <div className="mt-4">
                    <a 
                      href={extractGoogleDocsLink(currentBrief) || "#"} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open Google Docs Link
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {briefDialogMode === "edit" ? (
              <Button type="submit" onClick={saveBrief}>Save Changes</Button>
            ) : (
              <Button type="button" onClick={() => setIsBriefDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPlan;

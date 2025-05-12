
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentTable } from "@/components/marketing/social-media/ContentTable";
import { useContentManagement } from "@/hooks/useContentManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
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
    resetRevisionCounter,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices
  } = useContentManagement();

  const [selectAll, setSelectAll] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [isUserManager, setIsUserManager] = useState(false);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBriefItemId, setCurrentBriefItemId] = useState<string>("");
  const [briefContent, setBriefContent] = useState("");
  const [briefMode, setBriefMode] = useState<"edit" | "view">("view");
  
  // Check if current user is a manager
  useEffect(() => {
    const checkUserRole = async () => {
      const employeesJson = localStorage.getItem('employees');
      if (employeesJson) {
        try {
          const employees = JSON.parse(employeesJson);
          const currentUserEmail = localStorage.getItem('currentUserEmail');
          
          if (currentUserEmail) {
            const currentEmployee = employees.find((emp: any) => 
              emp.email === currentUserEmail && 
              emp.organization === "Digital Marketing" && 
              emp.jobPosition?.includes("Manager")
            );
            
            setIsUserManager(!!currentEmployee);
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
    };
    
    checkUserRole();
  }, []);

  const toggleCalendar = (itemId: string) => {
    setIsCalendarOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleDateChange = (itemId: string, date: Date | undefined) => {
    if (date) {
      updateContentItem(itemId, { postDate: date.toISOString().split('T')[0] });
      toggleCalendar(itemId);
    }
  };

  const handleTypeChange = (itemId: string, typeId: string) => {
    updateContentItem(itemId, { contentType: typeId });
  };

  const handlePICChange = (itemId: string, picName: string) => {
    updateContentItem(itemId, { pic: picName });
  };

  const handleServiceChange = (itemId: string, serviceId: string) => {
    // Reset subService when service changes
    updateContentItem(itemId, { service: serviceId, subService: "" });
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

  const handleApprovalChange = (itemId: string, isApproved: boolean) => {
    if (isUserManager) {
      updateContentItem(itemId, { isApproved });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };

  const handleAddRow = () => {
    addContentItem();
    toast.success("New content row added");
  };

  const handleDeleteSelected = () => {
    const selectedIds = contentItems
      .filter(item => item.isSelected)
      .map(item => item.id);
    
    if (selectedIds.length === 0) {
      toast.error("No items selected");
      return;
    }
    
    deleteContentItems(selectedIds);
    toast.success(`${selectedIds.length} item(s) deleted`);
  };

  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentBriefItemId(itemId);
    setBriefContent(brief);
    setBriefMode(mode);
    setIsBriefDialogOpen(true);
  };

  const handleSaveBrief = () => {
    updateContentItem(currentBriefItemId, { brief: briefContent });
    setIsBriefDialogOpen(false);
    toast.success("Brief updated successfully");
  };

  const extractGoogleDocsLink = (text: string): string | null => {
    const regex = /(https:\/\/docs\.google\.com\S+)/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  const displayBrief = (brief: string): string => {
    if (!brief) return "Click to add brief";
    if (brief.length <= 25) return brief;
    return brief.substring(0, 25) + "...";
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-semibold">Content Management</CardTitle>
          <div className="flex space-x-2">
            {isUserManager && (
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
              variant="default" 
              size="sm"
              onClick={handleAddRow}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Row
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{briefMode === "edit" ? "Edit Brief" : "View Brief"}</DialogTitle>
            <DialogDescription>
              {briefMode === "edit" 
                ? "Provide details about the content in this brief. Google Docs links will be automatically detected." 
                : "Content brief details:"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            {briefMode === "edit" ? (
              <Textarea
                value={briefContent}
                onChange={(e) => setBriefContent(e.target.value)}
                placeholder="Write brief details here..."
                className="min-h-[200px]"
              />
            ) : (
              <div className="p-4 border rounded-md bg-gray-50 prose max-w-none">
                {briefContent.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}

                {extractGoogleDocsLink(briefContent) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Google Document:</h4>
                    <iframe 
                      src={`${extractGoogleDocsLink(briefContent)}?embedded=true`}
                      className="w-full h-[400px] border rounded-md"
                      title="Google Document Preview"
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {briefMode === "edit" && (
              <Button onClick={handleSaveBrief}>Save Brief</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPlan;

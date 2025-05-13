
import React, { useState } from "react";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, RefreshCw, ExternalLink, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentPlanItem, useContentPlan } from "@/hooks/useContentPlan";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ContentPlan() {
  const {
    contentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter
  } = useContentPlan();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // For adding new rows
  const addNewRow = () => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    
    addContentPlan({
      post_date: formattedDate,
      revision_count: 0,
      production_revision_count: 0,
      approved: false,
      production_approved: false,
      done: false,
      status: "",
      production_status: ""
    });
  };

  // Handler for checkbox selection
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  // Handler for deleting selected items
  const handleDeleteSelected = async () => {
    for (const id of selectedItems) {
      await deleteContentPlan(id);
    }
    setSelectedItems([]);
  };

  // Handler for updating date
  const handleDateChange = async (id: string, date: Date | undefined) => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    await updateContentPlan(id, { post_date: formattedDate });
  };

  // Handler for updating fields
  const handleFieldChange = async (id: string, field: string, value: any) => {
    let updates: any = { [field]: value };
    
    // Reset status fields when brief changes
    if (field === 'brief') {
      updates.status = "";
    }
    
    // Reset production status when google drive link changes
    if (field === 'google_drive_link') {
      updates.production_status = "";
    }
    
    // Auto-populate completion date when status is "Butuh Di Review"
    if (field === 'status' && value === "Butuh Di Review") {
      const now = new Date();
      updates.completion_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'status' && value !== "Butuh Di Review") {
      updates.completion_date = null;
    }
    
    // Auto-populate production completion date when production status is "Butuh Di Review"
    if (field === 'production_status' && value === "Butuh Di Review") {
      const now = new Date();
      updates.production_completion_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'production_status' && value !== "Butuh Di Review") {
      updates.production_completion_date = null;
    }
    
    // Auto-populate actual post date when post link is added
    if (field === 'post_link' && value) {
      const now = new Date();
      updates.actual_post_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'post_link' && !value) {
      updates.actual_post_date = null;
    }
    
    // If status changes to "Request Revisi", increment revision count
    if (field === 'status' && value === "Request Revisi") {
      const item = contentPlans.find(plan => plan.id === id);
      if (item) {
        updates.revision_count = (item.revision_count || 0) + 1;
      }
    }
    
    // If production status changes to "Request Revisi", increment production revision count
    if (field === 'production_status' && value === "Request Revisi") {
      const item = contentPlans.find(plan => plan.id === id);
      if (item) {
        updates.production_revision_count = (item.production_revision_count || 0) + 1;
      }
    }
    
    // If approved is set, auto-populate production_approved_date
    if (field === 'production_approved' && value === true) {
      const now = new Date();
      updates.production_approved_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'production_approved' && value === false) {
      updates.production_approved_date = null;
    }
    
    await updateContentPlan(id, updates);
  };

  // Format date for display
  const formatDisplayDate = (dateString: string | null, includeTime: boolean = false) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return includeTime 
        ? format(date, "dd MMM yyyy - HH:mm")
        : format(date, "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Handle brief dialog
  const openBriefDialog = (id: string, brief: string | null) => {
    setCurrentItemId(id);
    setCurrentBrief(brief || "");
    setIsBriefDialogOpen(true);
  };

  const saveBrief = async () => {
    if (currentItemId) {
      await handleFieldChange(currentItemId, 'brief', currentBrief);
    }
    setIsBriefDialogOpen(false);
  };

  // Check if a Google Docs link is present in the brief
  const extractGoogleDocsLink = (brief: string | null) => {
    if (!brief) return null;
    const regex = /(https:\/\/docs\.google\.com\S+)/g;
    const match = brief.match(regex);
    return match ? match[0] : null;
  };

  // Display text in table cell with truncation
  const truncateText = (text: string | null, maxLength: number = 25) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={addNewRow}>+ Add Row</Button>
          {selectedItems.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete Selected ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="text-center w-[50px]">Action</TableHead>
                <TableHead className="text-center w-[120px]">Tanggal Posting</TableHead>
                <TableHead className="text-center w-[150px]">Tipe Content</TableHead>
                <TableHead className="text-center w-[150px]">PIC</TableHead>
                <TableHead className="text-center w-[150px]">Layanan</TableHead>
                <TableHead className="text-center w-[150px]">Sub Layanan</TableHead>
                <TableHead className="text-center w-[180px]">Judul Content</TableHead>
                <TableHead className="text-center w-[150px]">Content Pillar</TableHead>
                <TableHead className="text-center w-[150px]">Brief</TableHead>
                <TableHead className="text-center w-[150px]">Status</TableHead>
                <TableHead className="text-center w-[80px]">Revision</TableHead>
                <TableHead className="text-center w-[80px]">Approved</TableHead>
                <TableHead className="text-center w-[150px]">Tanggal Selesai</TableHead>
                <TableHead className="text-center w-[120px]">Tanggal Upload</TableHead>
                <TableHead className="text-center w-[150px]">Tipe Content</TableHead>
                <TableHead className="text-center w-[180px]">Judul Content</TableHead>
                <TableHead className="text-center w-[150px]">PIC Produksi</TableHead>
                <TableHead className="text-center w-[150px]">Link Google Drive</TableHead>
                <TableHead className="text-center w-[150px]">Status Produksi</TableHead>
                <TableHead className="text-center w-[80px]">Revisi Counter</TableHead>
                <TableHead className="text-center w-[150px]">Tanggal Selesai Produksi</TableHead>
                <TableHead className="text-center w-[80px]">Approved</TableHead>
                <TableHead className="text-center w-[150px]">Tanggal Approved</TableHead>
                <TableHead className="text-center w-[150px]">Download Link File</TableHead>
                <TableHead className="text-center w-[150px]">Link Post</TableHead>
                <TableHead className="text-center w-[80px]">Done</TableHead>
                <TableHead className="text-center w-[150px]">Actual Post</TableHead>
                <TableHead className="text-center w-[150px]">On Time Status</TableHead>
                <TableHead className="text-center w-[150px]">Status Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={28} className="text-center py-4">Loading content plans...</TableCell>
                </TableRow>
              ) : contentPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={28} className="text-center py-4">No content plans available. Add a new row to get started.</TableCell>
                </TableRow>
              ) : (
                contentPlans.map((item: any) => (
                  <TableRow key={item.id}>
                    {/* 1. Action (Checkbox) */}
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={selectedItems.includes(item.id)} 
                        onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)} 
                      />
                    </TableCell>

                    {/* 2. Tanggal Posting */}
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            {item.post_date ? formatDisplayDate(item.post_date) : "Select date"}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={item.post_date ? new Date(item.post_date) : undefined}
                            onSelect={(date) => handleDateChange(item.id, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* 3. Tipe Content */}
                    <TableCell>
                      <Select 
                        value={item.content_type_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'content_type_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 4. PIC */}
                    <TableCell>
                      <Select 
                        value={item.pic_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'pic_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {getFilteredTeamMembers("Content Planner").map((member) => (
                            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 5. Layanan */}
                    <TableCell>
                      <Select 
                        value={item.service_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'service_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 6. Sub Layanan */}
                    <TableCell>
                      <Select 
                        value={item.sub_service_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'sub_service_id', value)}
                        disabled={!item.service_id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {item.service_id && getFilteredSubServices(item.service_id).map((subService) => (
                            <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 7. Judul Content */}
                    <TableCell>
                      <Input
                        value={item.title || ""}
                        onChange={(e) => handleFieldChange(item.id, 'title', e.target.value)}
                        placeholder="Enter title"
                        title={item.title || ""}
                        className="w-full"
                      />
                    </TableCell>

                    {/* 8. Content Pillar */}
                    <TableCell>
                      <Select 
                        value={item.content_pillar_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'content_pillar_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {contentPillars.map((pillar) => (
                            <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 9. Brief */}
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openBriefDialog(item.id, item.brief)}
                        className="w-full flex items-center justify-center gap-1"
                      >
                        {item.brief ? truncateText(item.brief) : "Click to add brief"}
                      </Button>
                      {extractGoogleDocsLink(item.brief) && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-1 w-full"
                          asChild
                        >
                          <a href={extractGoogleDocsLink(item.brief)!} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" /> Open Doc
                          </a>
                        </Button>
                      )}
                    </TableCell>

                    {/* 10. Status */}
                    <TableCell>
                      <Select 
                        value={item.status || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                          <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 11. Revision */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>{item.revision_count || 0}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => resetRevisionCounter(item.id, 'revision_count')}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>

                    {/* 12. Approved */}
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={item.approved} 
                        onCheckedChange={(checked) => handleFieldChange(item.id, 'approved', !!checked)}
                      />
                    </TableCell>

                    {/* 13. Tanggal Selesai */}
                    <TableCell>
                      {item.status === "Butuh Di Review" && item.completion_date && (
                        <div className="text-center">
                          {formatDisplayDate(item.completion_date, true)}
                        </div>
                      )}
                    </TableCell>

                    {/* 14. Tanggal Upload (Mirror of Tanggal Posting) */}
                    <TableCell className="text-center">
                      {formatDisplayDate(item.post_date)}
                    </TableCell>

                    {/* 15. Tipe Content (Mirror) */}
                    <TableCell className="text-center">
                      {item.content_type || "-"}
                    </TableCell>

                    {/* 16. Judul Content (Mirror) */}
                    <TableCell>
                      <div className="truncate max-w-[180px]" title={item.title || ""}>
                        {truncateText(item.title)}
                      </div>
                    </TableCell>

                    {/* 17. PIC Produksi */}
                    <TableCell>
                      <Select 
                        value={item.pic_production_id || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'pic_production_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          {getFilteredTeamMembers("Creative").filter(m => m.role === "Produksi").map((member) => (
                            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 18. Link Google Drive */}
                    <TableCell>
                      <Input
                        value={item.google_drive_link || ""}
                        onChange={(e) => handleFieldChange(item.id, 'google_drive_link', e.target.value)}
                        placeholder="Enter link"
                        className="w-full"
                      />
                    </TableCell>

                    {/* 19. Status Produksi */}
                    <TableCell>
                      <Select 
                        value={item.production_status || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'production_status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                          <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* 20. Revisi Counter (Production) */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>{item.production_revision_count || 0}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => resetRevisionCounter(item.id, 'production_revision_count')}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>

                    {/* 21. Tanggal Selesai Produksi */}
                    <TableCell>
                      {item.production_status === "Butuh Di Review" && item.production_completion_date && (
                        <div className="text-center">
                          {formatDisplayDate(item.production_completion_date, true)}
                        </div>
                      )}
                    </TableCell>

                    {/* 22. Approved (Production) */}
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={item.production_approved} 
                        onCheckedChange={(checked) => handleFieldChange(item.id, 'production_approved', !!checked)}
                      />
                    </TableCell>

                    {/* 23. Tanggal Approved */}
                    <TableCell className="text-center">
                      {item.production_approved && item.production_approved_date ? formatDisplayDate(item.production_approved_date, true) : ""}
                    </TableCell>

                    {/* 24. Download Link File (Mirror of Google Drive Link if approved) */}
                    <TableCell>
                      {item.production_approved && item.google_drive_link && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                            <Link className="h-3 w-3 mr-1" /> Download
                          </a>
                        </Button>
                      )}
                    </TableCell>

                    {/* 25. Link Post */}
                    <TableCell>
                      <Input
                        value={item.post_link || ""}
                        onChange={(e) => handleFieldChange(item.id, 'post_link', e.target.value)}
                        placeholder="Enter post link"
                        className="w-full"
                      />
                      {item.post_link && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-1 w-full"
                          asChild
                        >
                          <a href={item.post_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" /> View
                          </a>
                        </Button>
                      )}
                    </TableCell>

                    {/* 26. Done */}
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={item.done} 
                        onCheckedChange={(checked) => handleFieldChange(item.id, 'done', !!checked)}
                      />
                    </TableCell>

                    {/* 27. Actual Post */}
                    <TableCell className="text-center">
                      {item.actual_post_date ? formatDisplayDate(item.actual_post_date, true) : ""}
                    </TableCell>

                    {/* 28. On Time Status */}
                    <TableCell className="text-center">
                      {item.on_time_status || ""}
                    </TableCell>

                    {/* 29. Status Content */}
                    <TableCell>
                      <Select 
                        value={item.status_content || ""} 
                        onValueChange={(value) => handleFieldChange(item.id, 'status_content', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-</SelectItem>
                          <SelectItem value="Recomended For Ads">Recomended For Ads</SelectItem>
                          <SelectItem value="Cancel">Cancel</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brief</DialogTitle>
            <DialogDescription>
              Enter the content brief details below. You can also include Google Docs links.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={currentBrief}
              onChange={(e) => setCurrentBrief(e.target.value)}
              placeholder="Enter brief content..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBriefDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveBrief}>
              Save Brief
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, RefreshCw, ExternalLink, Link, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContentPlanItem, useContentPlan } from "@/hooks/content-plan";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOrganization } from "@/hooks/useOrganization";

export default function ContentPlan() {
  const {
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  } = useContentPlan();
  
  const { organization } = useOrganization();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");

  // Content planners for PIC dropdown
  const contentPlanners = getContentPlannerTeamMembers();
  
  // Creative team members for PIC Production dropdown
  const creativeTeamMembers = getCreativeTeamMembers();

  // For adding new rows
  const addNewRow = () => {
    if (!organization?.id) {
      console.error("Cannot add row: No organization ID available");
      // Maybe show an error toast here
      return;
    }
    
    console.log("Adding new row with organization ID:", organization.id);
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
      production_status: "",
      organization_id: organization.id
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
    await updateContentPlan(id, {
      post_date: formattedDate
    });
  };

  // Handler for updating fields
  const handleFieldChange = async (id: string, field: string, value: any) => {
    let updates: any = {
      [field]: value
    };

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
      updates.actual_post_date = format(now, "yyyy-MM-dd");
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

  // Check if a Google Docs link is present in the brief
  const extractLink = (text: string | null) => {
    if (!text) return null;
    const regex = /(https?:\/\/\S+)/g;
    const match = text.match(regex);
    return match ? match[0] : null;
  };

  // Display text in table cell with truncation
  const truncateText = (text: string | null, maxLength: number = 25) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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

  // Handle title dialog
  const openTitleDialog = (id: string, title: string | null) => {
    setCurrentItemId(id);
    setCurrentTitle(title || "");
    setIsTitleDialogOpen(true);
  };
  const saveTitle = async () => {
    if (currentItemId) {
      await handleFieldChange(currentItemId, 'title', currentTitle);
    }
    setIsTitleDialogOpen(false);
  };

  return <div className="w-full space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={addNewRow}>+ Add Row</Button>
          {selectedItems.length > 0 && <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete Selected ({selectedItems.length})
            </Button>}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load content plan data. Please check your organization settings and try again."}
          </AlertDescription>
        </Alert>
      )}
      
      {!organization?.id && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Organization Required</AlertTitle>
          <AlertDescription>
            No organization context found. Please ensure you're logged in and belong to an organization.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <div className="h-[600px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="min-width-3200 table-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">Action</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Tanggal Posting</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Tipe Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px] border-r">PIC</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Layanan</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Sub Layanan</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Judul Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Content Pillar</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Brief</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Status</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Revision</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Selesai</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Tanggal Upload</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Tipe Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Judul Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">PIC Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Link Google Drive</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Status Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Revisi Counter</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Selesai Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Download Link File</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Link Post</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[80px] border-r">Done</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Actual Post</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px] border-r">On Time Status</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Status Content</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? <TableRow>
                      <TableCell colSpan={29} className="text-center py-4">Loading content plans...</TableCell>
                    </TableRow> : contentPlans.length === 0 ? <TableRow>
                      <TableCell colSpan={29} className="text-center py-4">No content plans available. Add a new row to get started.</TableCell>
                    </TableRow> : contentPlans.map((item: any) => <TableRow key={item.id}>
                        {/* 1. Action (Checkbox) */}
                        <TableCell className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">
                          <div className="flex justify-center">
                            <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={checked => handleSelectItem(item.id, !!checked)} />
                          </div>
                        </TableCell>

                        {/* 2. Tanggal Posting */}
                        <TableCell className="whitespace-nowrap p-1 w-[180px] border-r">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full h-8">
                                {item.post_date ? formatDisplayDate(item.post_date) : "Select date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={item.post_date ? new Date(item.post_date) : undefined} onSelect={date => handleDateChange(item.id, date)} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </TableCell>

                        {/* 3. Tipe Content */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px] border-r">
                          <Select value={item.content_type_id || "none"} onValueChange={value => handleFieldChange(item.id, 'content_type_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {contentTypes.map(type => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 4. PIC - Now references Content Planners */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px] border-r">
                          <Select value={item.pic_id || "none"} onValueChange={value => handleFieldChange(item.id, 'pic_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {contentPlanners.map(member => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 5. Layanan */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px] border-r">
                          <Select value={item.service_id || "none"} onValueChange={value => handleFieldChange(item.id, 'service_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {services.map(service => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 6. Sub Layanan */}
                        <TableCell className="whitespace-nowrap p-1 w-[150px] border-r">
                          <Select value={item.sub_service_id || "none"} onValueChange={value => handleFieldChange(item.id, 'sub_service_id', value === "none" ? "" : value)} disabled={!item.service_id}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {item.service_id && getFilteredSubServices(item.service_id).map(subService => <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 7. Judul Content - Modified to add popup view */}
                        <TableCell className="p-1 w-[180px] border-r">
                          <Button variant="ghost" size="sm" onClick={() => openTitleDialog(item.id, item.title)} className="w-full h-8 flex items-center justify-start px-3 hover:bg-gray-50 truncate text-left" title={item.title || ""}>
                            {item.title ? truncateText(item.title) : "Click to add title"}
                          </Button>
                        </TableCell>

                        {/* 8. Content Pillar */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px] border-r">
                          <Select value={item.content_pillar_id || "none"} onValueChange={value => handleFieldChange(item.id, 'content_pillar_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {contentPillars.map(pillar => <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 9. Brief - Modified to use a single field */}
                        <TableCell className="p-1 w-[150px] border-r">
                          <Button variant="ghost" className="w-full h-8 flex items-center justify-between px-3 hover:bg-gray-50 text-left" onClick={() => openBriefDialog(item.id, item.brief)}>
                            <span className="truncate flex-grow text-left">
                              {item.brief ? truncateText(item.brief) : "Add brief"}
                            </span>
                            {extractLink(item.brief) && <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />}
                          </Button>
                        </TableCell>

                        {/* 10. Status */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px] border-r">
                          <Select value={item.status || "none"} onValueChange={value => handleFieldChange(item.id, 'status', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                              <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 11. Revision */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px] border-r">
                          <div className="flex items-center justify-center gap-1">
                            <span>{item.revision_count || 0}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetRevisionCounter(item.id, 'revision_count')}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {/* 12. Approved */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px] border-r">
                          <div className="flex justify-center">
                            <Checkbox checked={item.approved} onCheckedChange={checked => handleFieldChange(item.id, 'approved', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 13. Tanggal Selesai */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px] border-r">
                          {item.status === "Butuh Di Review" && item.completion_date && <div className="text-center">
                              {formatDisplayDate(item.completion_date, true)}
                            </div>}
                        </TableCell>

                        {/* 14. Tanggal Upload (Mirror of Tanggal Posting) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[120px] border-r">
                          {formatDisplayDate(item.post_date)}
                        </TableCell>

                        {/* 15. Tipe Content (Mirror) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[140px] border-r">
                          <div className="truncate" title={item.content_type?.name || item.content_type || "-"}>
                            {item.content_type?.name || item.content_type || "-"}
                          </div>
                        </TableCell>

                        {/* 16. Judul Content (Mirror) */}
                        <TableCell className="whitespace-nowrap p-1 w-[180px] border-r">
                          <div className="truncate max-w-full" title={item.title || ""}>
                            {truncateText(item.title)}
                          </div>
                        </TableCell>

                        {/* 17. PIC Produksi - Now references Creative team members */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px] border-r">
                          <Select value={item.pic_production_id || "none"} onValueChange={value => handleFieldChange(item.id, 'pic_production_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {creativeTeamMembers.map(member => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 18. Link Google Drive - Modified to use a single field */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px] border-r">
                          <div className="flex items-center gap-1">
                            <Input value={item.google_drive_link || ""} onChange={e => handleFieldChange(item.id, 'google_drive_link', e.target.value)} placeholder="Enter link" className="w-full h-8 text-xs" />
                            {item.google_drive_link && <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" asChild>
                                <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>}
                          </div>
                        </TableCell>

                        {/* 19. Status Produksi */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px] border-r">
                          <Select value={item.production_status || "none"} onValueChange={value => handleFieldChange(item.id, 'production_status', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                              <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 20. Revisi Counter (Production) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[120px] border-r">
                          <div className="flex items-center justify-center gap-1">
                            <span>{item.production_revision_count || 0}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetRevisionCounter(item.id, 'production_revision_count')}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {/* 21. Tanggal Selesai Produksi */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px] border-r">
                          {item.production_status === "Butuh Di Review" && item.production_completion_date && <div className="text-center">
                              {formatDisplayDate(item.production_completion_date, true)}
                            </div>}
                        </TableCell>

                        {/* 22. Approved (Production) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px] border-r">
                          <div className="flex justify-center">
                            <Checkbox checked={item.production_approved} onCheckedChange={checked => handleFieldChange(item.id, 'production_approved', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 23. Tanggal Approved */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[160px] border-r">
                          {item.production_approved && item.production_approved_date ? formatDisplayDate(item.production_approved_date, true) : ""}
                        </TableCell>

                        {/* 24. Download Link File (Mirror of Google Drive Link if approved) */}
                        <TableCell className="p-1 w-[150px] border-r">
                          {item.production_approved && item.google_drive_link && <Button variant="outline" size="sm" className="w-full h-8" asChild>
                              <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                                <Link className="h-3 w-3 mr-1" /> Download
                              </a>
                            </Button>}
                        </TableCell>

                        {/* 25. Link Post - Modified to be wider and use a single field with integrated button */}
                        <TableCell className="p-1 w-[220px] border-r">
                          <div className="flex items-center gap-1">
                            <Input value={item.post_link || ""} onChange={e => handleFieldChange(item.id, 'post_link', e.target.value)} placeholder="Enter post link" className="w-full h-8 text-xs" />
                            {item.post_link && <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" asChild>
                                <a href={item.post_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>}
                          </div>
                        </TableCell>

                        {/* 26. Done */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[80px] border-r">
                          <div className="flex justify-center">
                            <Checkbox checked={item.done} onCheckedChange={checked => handleFieldChange(item.id, 'done', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 27. Actual Post - Modified to show simple date format */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[160px] border-r">
                          {item.actual_post_date ? format(new Date(item.actual_post_date), "dd MMM yyyy") : ""}
                        </TableCell>

                        {/* 28. On Time Status */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[140px] border-r">
                          <div className="truncate" title={item.on_time_status || ""}>
                            {item.on_time_status || ""}
                          </div>
                        </TableCell>

                        {/* 29. Status Content */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px]">
                          <Select value={item.status_content || "none"} onValueChange={value => handleFieldChange(item.id, 'status_content', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              <SelectItem value="Recomended For Ads">Recomended For Ads</SelectItem>
                              <SelectItem value="Cancel">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brief</DialogTitle>
            <DialogDescription>
              Enter the content brief details below. You can also include links.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea value={currentBrief} onChange={e => setCurrentBrief(e.target.value)} placeholder="Enter brief content..." className="min-h-[200px]" />
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

      {/* Title Dialog */}
      <Dialog open={isTitleDialogOpen} onOpenChange={setIsTitleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
            <DialogDescription>
              Enter the content title below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="Enter content title..." className="min-h-[120px]" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsTitleDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveTitle}>
              Save Title
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}

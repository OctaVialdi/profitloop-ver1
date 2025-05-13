
import React, { useState, useCallback, useEffect } from "react";
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, RefreshCw, ExternalLink, Link, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    resetRevisionCounter,
    formatDisplayDate
  } = useContentPlan();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
  const [isLinkPostDialogOpen, setIsLinkPostDialogOpen] = useState(false);
  const [currentLinkPost, setCurrentLinkPost] = useState("");

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
  
  // Select all handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItemIds = contentPlans.map(item => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
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
      updates.actual_post_date = format(now, "yyyy-MM-dd HH:mm");
      
      // Calculate on_time_status by comparing dates (ignoring time)
      const item = contentPlans.find(plan => plan.id === id);
      if (item && item.post_date) {
        const plannedDate = new Date(item.post_date);
        const actualDate = new Date(updates.actual_post_date);
        
        // Just compare the date (ignoring time)
        if (isSameDay(actualDate, plannedDate)) {
          updates.on_time_status = 'On Time';
        } else if (actualDate < plannedDate) {
          updates.on_time_status = 'Early';
        } else {
          const diffDays = Math.ceil((actualDate.getTime() - plannedDate.getTime()) / (1000 * 60 * 60 * 24));
          updates.on_time_status = `Late [${diffDays}] Day/s`;
        }
      }
    } else if (field === 'post_link' && !value) {
      updates.actual_post_date = null;
      updates.on_time_status = "";
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
  const extractGoogleDocsLink = (brief: string | null) => {
    if (!brief) return null;
    const regex = /(https:\/\/docs\.google\.com\S+)/g;
    const match = brief.match(regex);
    return match ? match[0] : null;
  };

  // Extract any link from text
  const extractLinks = (text: string | null) => {
    if (!text) return [];
    const regex = /(https?:\/\/[^\s]+)/g;
    return text.match(regex) || [];
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
    const links = extractLinks(brief || "");
    setLinkPreview(links.length > 0 ? links[0] : null);
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

  // Handle link post dialog
  const openLinkPostDialog = (id: string, postLink: string | null) => {
    setCurrentItemId(id);
    setCurrentLinkPost(postLink || "");
    setIsLinkPostDialogOpen(true);
  };

  const saveLinkPost = async () => {
    if (currentItemId) {
      await handleFieldChange(currentItemId, 'post_link', currentLinkPost);
    }
    setIsLinkPostDialogOpen(false);
  };

  // Effect to update link preview when brief changes
  useEffect(() => {
    const links = extractLinks(currentBrief);
    setLinkPreview(links.length > 0 ? links[0] : null);
  }, [currentBrief]);

  return <div className="w-full space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={addNewRow}>+ Add Row</Button>
          {selectedItems.length > 0 && <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete Selected ({selectedItems.length})
            </Button>}
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="h-[600px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="w-full table-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px]">
                      <Checkbox 
                        checked={contentPlans.length > 0 && selectedItems.length === contentPlans.length} 
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px]">Tanggal Posting</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">Tipe Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">PIC</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">Layanan</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px]">Sub Layanan</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px]">Judul Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">Content Pillar</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">Brief</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">Status</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px]">Revision</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px]">Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Tanggal Selesai</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">Tanggal Upload</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">Tipe Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[180px]">Judul Content</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">PIC Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Link Google Drive</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">Status Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[120px]">Revisi Counter</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Tanggal Selesai Produksi</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[100px]">Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Tanggal Approved</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px]">Download Link File</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[150px]">Link Post</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[80px]">Done</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[160px]">Actual Post</TableHead>
                    <TableHead className="text-center whitespace-nowrap w-[140px]">On Time Status</TableHead>
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
                        <TableCell className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px]">
                          <div className="flex justify-center">
                            <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={checked => handleSelectItem(item.id, !!checked)} />
                          </div>
                        </TableCell>

                        {/* 2. Tanggal Posting */}
                        <TableCell className="whitespace-nowrap p-1 w-[180px]">
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
                        <TableCell className="whitespace-nowrap p-1 w-[140px]">
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

                        {/* 4. PIC */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px]">
                          <Select value={item.pic_id || "none"} onValueChange={value => handleFieldChange(item.id, 'pic_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {getFilteredTeamMembers("Content Planner").map(member => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 5. Layanan */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px]">
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
                        <TableCell className="whitespace-nowrap p-1 w-[150px]">
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

                        {/* 7. Judul Content */}
                        <TableCell className="p-1 w-[180px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 flex items-center justify-between gap-1 truncate text-left"
                            onClick={() => openTitleDialog(item.id, item.title)}
                          >
                            <span className="truncate">{item.title || "Click to add title"}</span>
                            <Edit className="h-3 w-3 flex-shrink-0" />
                          </Button>
                        </TableCell>

                        {/* 8. Content Pillar */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px]">
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

                        {/* 9. Brief */}
                        <TableCell className="p-1 w-[120px]">
                          <Button variant="ghost" size="sm" onClick={() => openBriefDialog(item.id, item.brief)} className="w-full h-8 flex items-center justify-between gap-1 truncate text-left">
                            <span className="truncate">{item.brief ? truncateText(item.brief) : "Click to add brief"}</span>
                            <Edit className="h-3 w-3 flex-shrink-0" />
                          </Button>
                          {extractGoogleDocsLink(item.brief) && <Button size="sm" variant="outline" className="mt-1 w-full h-7" asChild>
                              <a href={extractGoogleDocsLink(item.brief)!} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" /> Open Doc
                              </a>
                            </Button>}
                        </TableCell>

                        {/* 10. Status */}
                        <TableCell className="whitespace-nowrap p-1 w-[120px]">
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
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px]">
                          <div className="flex items-center justify-center gap-1">
                            <span>{item.revision_count || 0}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetRevisionCounter(item.id, 'revision_count')}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {/* 12. Approved */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px]">
                          <div className="flex justify-center">
                            <Checkbox checked={item.approved} onCheckedChange={checked => handleFieldChange(item.id, 'approved', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 13. Tanggal Selesai */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px]">
                          {item.status === "Butuh Di Review" && item.completion_date && <div className="text-center">
                              {formatDisplayDate(item.completion_date, true)}
                            </div>}
                        </TableCell>

                        {/* 14. Tanggal Upload (Mirror of Tanggal Posting) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[120px]">
                          {formatDisplayDate(item.post_date)}
                        </TableCell>

                        {/* 15. Tipe Content (Mirror) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[140px]">
                          <div className="truncate" title={item.content_type?.name || item.content_type || "-"}>
                            {item.content_type?.name || item.content_type || "-"}
                          </div>
                        </TableCell>

                        {/* 16. Judul Content (Mirror) */}
                        <TableCell className="whitespace-nowrap p-1 w-[180px]">
                          <div className="truncate max-w-full" title={item.title || ""}>
                            {truncateText(item.title)}
                          </div>
                        </TableCell>

                        {/* 17. PIC Produksi */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px]">
                          <Select value={item.pic_production_id || "none"} onValueChange={value => handleFieldChange(item.id, 'pic_production_id', value === "none" ? "" : value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {getFilteredTeamMembers("Creative").filter(m => m.role === "Produksi").map(member => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 18. Link Google Drive */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px]">
                          <div className="flex flex-col gap-1">
                            <Input 
                              value={item.google_drive_link || ""} 
                              onChange={e => handleFieldChange(item.id, 'google_drive_link', e.target.value)} 
                              placeholder="Enter link" 
                              className="w-full h-8 truncate" 
                            />
                            {item.google_drive_link && (
                              <Button variant="outline" size="sm" className="w-full h-7" asChild>
                                <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" /> Open Link
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        {/* 19. Status Produksi */}
                        <TableCell className="whitespace-nowrap p-1 w-[140px]">
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
                        <TableCell className="text-center whitespace-nowrap p-1 w-[120px]">
                          <div className="flex items-center justify-center gap-1">
                            <span>{item.production_revision_count || 0}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetRevisionCounter(item.id, 'production_revision_count')}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {/* 21. Tanggal Selesai Produksi */}
                        <TableCell className="whitespace-nowrap p-1 w-[160px]">
                          {item.production_status === "Butuh Di Review" && item.production_completion_date && <div className="text-center">
                              {formatDisplayDate(item.production_completion_date, true)}
                            </div>}
                        </TableCell>

                        {/* 22. Approved (Production) */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[100px]">
                          <div className="flex justify-center">
                            <Checkbox checked={item.production_approved} onCheckedChange={checked => handleFieldChange(item.id, 'production_approved', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 23. Tanggal Approved */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[160px]">
                          {item.production_approved && item.production_approved_date ? formatDisplayDate(item.production_approved_date, true) : ""}
                        </TableCell>

                        {/* 24. Download Link File (Mirror of Google Drive Link if approved) */}
                        <TableCell className="p-1 w-[150px]">
                          {item.production_approved && item.google_drive_link && <Button variant="outline" size="sm" className="w-full h-8" asChild>
                              <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                                <Link className="h-3 w-3 mr-1" /> Download
                              </a>
                            </Button>}
                        </TableCell>

                        {/* 25. Link Post - Combined field */}
                        <TableCell className="p-1 w-[150px]">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-8 flex items-center justify-between gap-1 truncate text-left"
                              onClick={() => openLinkPostDialog(item.id, item.post_link)}
                            >
                              <span className="truncate">{item.post_link ? truncateText(item.post_link) : "Click to add link"}</span>
                              <div className="flex gap-1 flex-shrink-0">
                                {item.post_link && <Eye className="h-3 w-3" />}
                                <Edit className="h-3 w-3" />
                              </div>
                            </Button>
                            
                            {item.post_link && (
                              <Button variant="outline" size="sm" className="w-full h-7" asChild>
                                <a href={item.post_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" /> View
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        {/* 26. Done */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[80px]">
                          <div className="flex justify-center">
                            <Checkbox checked={item.done} onCheckedChange={checked => handleFieldChange(item.id, 'done', !!checked)} />
                          </div>
                        </TableCell>

                        {/* 27. Actual Post */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[160px]">
                          {item.actual_post_date ? formatDisplayDate(item.actual_post_date, true) : ""}
                        </TableCell>

                        {/* 28. On Time Status */}
                        <TableCell className="text-center whitespace-nowrap p-1 w-[140px]">
                          <div className={`truncate font-medium ${item.on_time_status?.includes('Late') ? 'text-red-500' : 
                                           item.on_time_status === 'On Time' ? 'text-green-500' : 
                                           item.on_time_status === 'Early' ? 'text-blue-500' : ''}`}>
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
              Enter the content brief details below. You can also include Google Docs links.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea value={currentBrief} onChange={e => setCurrentBrief(e.target.value)} placeholder="Enter brief content..." className="min-h-[200px]" />
            
            {linkPreview && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Link Preview:</div>
                <div className="p-3 border rounded-md bg-slate-50 break-all">
                  <a 
                    href={linkPreview} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {linkPreview}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
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
            <Input 
              value={currentTitle} 
              onChange={e => setCurrentTitle(e.target.value)} 
              placeholder="Enter content title..."
            />
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

      {/* Link Post Dialog */}
      <Dialog open={isLinkPostDialogOpen} onOpenChange={setIsLinkPostDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post Link</DialogTitle>
            <DialogDescription>
              Enter the post link below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              value={currentLinkPost} 
              onChange={e => setCurrentLinkPost(e.target.value)} 
              placeholder="Enter post link..."
            />
            {currentLinkPost && (
              <div className="p-3 border rounded-md bg-slate-50 break-all">
                <a 
                  href={currentLinkPost} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {currentLinkPost}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLinkPostDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveLinkPost}>
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}

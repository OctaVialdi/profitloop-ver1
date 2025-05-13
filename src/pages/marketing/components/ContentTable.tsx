
import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RefreshCcw, Calendar as CalendarIcon, ExternalLink, Pencil
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useContentPlan, ContentPlanItem } from "@/hooks/useContentPlan";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LinkFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LinkField: React.FC<LinkFieldProps> = ({ value, onChange, placeholder = "Add link..." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [linkText, setLinkText] = useState(value);

  const handleSave = () => {
    onChange(linkText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setLinkText(value);
    }
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex gap-1">
          <Input 
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-xs h-7 w-full"
            autoFocus
          />
        </div>
      ) : (
        <div 
          className="flex items-center gap-1 cursor-pointer group"
          onClick={() => setIsEditing(true)}
        >
          {value ? (
            <>
              <div className="truncate max-w-[150px] text-blue-600 hover:underline">
                {value}
              </div>
              <a 
                href={value.startsWith("http") ? value : `https://${value}`} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              </a>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </>
          ) : (
            <span className="text-gray-400 text-xs">{placeholder}</span>
          )}
        </div>
      )}
    </div>
  );
};

const ContentTable: React.FC = () => {
  const { 
    contentPlans, 
    addContentPlan, 
    updateContentPlan, 
    deleteContentPlan, 
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    resetRevisionCounter,
    formatDisplayDate,
    getFilteredSubServices
  } = useContentPlan();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openBriefDialog, setOpenBriefDialog] = useState<string | null>(null);
  const [briefText, setBriefText] = useState("");
  const [openTitleDialog, setOpenTitleDialog] = useState<string | null>(null);
  const [titleText, setTitleText] = useState("");

  const { toast } = useToast();
  
  const handleRowCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(contentPlans.map(plan => plan.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    // Confirm before deleting
    if (window.confirm(`Delete ${selectedRows.length} selected items?`)) {
      selectedRows.forEach(id => {
        deleteContentPlan(id);
      });
      setSelectedRows([]);
      toast({
        title: "Success",
        description: `${selectedRows.length} items have been deleted`,
      });
    }
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (!date) return;
    updateContentPlan(id, { post_date: format(date, 'yyyy-MM-dd') });
  };

  const handleAddRow = () => {
    const today = new Date();
    addContentPlan({ 
      post_date: format(today, 'yyyy-MM-dd'),
    });
    toast({
      title: "New row added",
      description: "A new content plan item has been added",
    });
  };

  const handleBriefSave = (id: string) => {
    updateContentPlan(id, { 
      brief: briefText,
      status: "" // Reset status when brief changes
    });
    setOpenBriefDialog(null);
  };

  const handleTitleSave = (id: string) => {
    updateContentPlan(id, { title: titleText });
    setOpenTitleDialog(null);
  };

  const handleStatusChange = (id: string, status: string) => {
    const updates: Partial<ContentPlanItem> = { status };
    
    // If status is "Butuh Di Review", set completion date
    if (status === "Butuh Di Review") {
      updates.completion_date = format(new Date(), 'yyyy-MM-dd HH:mm');
    } else if (status === "") {
      updates.completion_date = undefined;
    }
    
    updateContentPlan(id, updates);
  };

  const handleProductionStatusChange = (id: string, status: string) => {
    const updates: Partial<ContentPlanItem> = { production_status: status };
    
    // If status is "Butuh Di Review", set production completion date
    if (status === "Butuh Di Review") {
      updates.production_completion_date = format(new Date(), 'yyyy-MM-dd HH:mm');
    } else if (status === "") {
      updates.production_completion_date = undefined;
    }
    
    updateContentPlan(id, updates);
  };

  const handleResetRevision = (id: string, field: 'revision_count' | 'production_revision_count') => {
    resetRevisionCounter(id, field);
  };

  const handleApprovalChange = (id: string, field: 'approved' | 'production_approved', checked: boolean) => {
    const updates: Partial<ContentPlanItem> = { [field]: checked };
    
    // For production approval, also set the approval date
    if (field === 'production_approved') {
      updates.production_approved_date = checked ? format(new Date(), 'yyyy-MM-dd HH:mm') : undefined;
    }
    
    updateContentPlan(id, updates);
  };

  const handleLinkChange = (id: string, field: string, value: string) => {
    const updates: Partial<ContentPlanItem> = { [field]: value };
    
    // Reset status when link changes for production
    if (field === 'google_drive_link') {
      updates.production_status = "";
    }
    
    // If adding post link, set actual post date
    if (field === 'post_link' && value) {
      updates.actual_post_date = format(new Date(), 'yyyy-MM-dd');
    } else if (field === 'post_link' && !value) {
      updates.actual_post_date = undefined;
      updates.on_time_status = undefined;
    }
    
    updateContentPlan(id, updates);
  };

  const getFilteredTeamMembers = (role: string) => {
    return teamMembers.filter(member => member.role === role);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddRow}
          >
            Add Row
          </Button>
          {selectedRows.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px] text-center sticky left-0 bg-gray-50 shadow-sm z-20">
                    <Checkbox 
                      checked={selectedRows.length === contentPlans.length && contentPlans.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Tanggal Posting</TableHead>
                  <TableHead className="whitespace-nowrap">Tipe Content</TableHead>
                  <TableHead className="whitespace-nowrap">PIC Content</TableHead>
                  <TableHead className="whitespace-nowrap">Layanan</TableHead>
                  <TableHead className="whitespace-nowrap">Sub Layanan</TableHead>
                  <TableHead className="whitespace-nowrap">Judul Content</TableHead>
                  <TableHead className="whitespace-nowrap">Content Pillar</TableHead>
                  <TableHead className="whitespace-nowrap">Brief</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Revision</TableHead>
                  <TableHead className="whitespace-nowrap">Approved</TableHead>
                  <TableHead className="whitespace-nowrap">Tanggal Selesai</TableHead>
                  <TableHead className="whitespace-nowrap">Tanggal Upload</TableHead>
                  <TableHead className="whitespace-nowrap">Tipe Content</TableHead>
                  <TableHead className="whitespace-nowrap">Judul Content</TableHead>
                  <TableHead className="whitespace-nowrap">PIC Produksi</TableHead>
                  <TableHead className="whitespace-nowrap">Link Google Drive</TableHead>
                  <TableHead className="whitespace-nowrap">Status Produksi</TableHead>
                  <TableHead className="whitespace-nowrap">Revisi Counter</TableHead>
                  <TableHead className="whitespace-nowrap">Tanggal Selesai Produksi</TableHead>
                  <TableHead className="whitespace-nowrap">Approved</TableHead>
                  <TableHead className="whitespace-nowrap">Tanggal Approved</TableHead>
                  <TableHead className="whitespace-nowrap">Download Link File</TableHead>
                  <TableHead className="whitespace-nowrap">Link Post</TableHead>
                  <TableHead className="whitespace-nowrap">Done</TableHead>
                  <TableHead className="whitespace-nowrap">Actual Post</TableHead>
                  <TableHead className="whitespace-nowrap">On Time Status</TableHead>
                  <TableHead className="whitespace-nowrap">Status Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentPlans.map((plan) => {
                  const postDate = plan.post_date ? new Date(plan.post_date) : new Date();
                  const service = services.find(s => s.id === plan.service_id);
                  const availableSubServices = getFilteredSubServices(plan.service_id || '');
                  
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="sticky left-0 bg-white shadow-sm z-10">
                        <Checkbox 
                          checked={selectedRows.includes(plan.id)}
                          onCheckedChange={(checked) => handleRowCheckbox(plan.id, !!checked)}
                        />
                      </TableCell>
                      
                      {/* Tanggal Posting */}
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant={"outline"} 
                              className="w-[150px] justify-start text-left text-xs font-normal h-7"
                            >
                              {plan.post_date ? format(new Date(plan.post_date), 'dd MMM yyyy') : 'Select date'}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={postDate}
                              onSelect={(date) => handleDateChange(plan.id, date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      
                      {/* Tipe Content */}
                      <TableCell>
                        <Select
                          value={plan.content_type_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { content_type_id: value === "none" ? undefined : value })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {contentTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* PIC Content */}
                      <TableCell>
                        <Select
                          value={plan.pic_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { pic_id: value === "none" ? undefined : value })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select person" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {getFilteredTeamMembers("Content Planner").map(member => (
                              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Layanan */}
                      <TableCell>
                        <Select
                          value={plan.service_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { 
                            service_id: value === "none" ? undefined : value,
                            sub_service_id: undefined // Reset sub service when service changes
                          })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {services.map(service => (
                              <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Sub Layanan */}
                      <TableCell>
                        <Select
                          value={plan.sub_service_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { 
                            sub_service_id: value === "none" ? undefined : value 
                          })}
                          disabled={!plan.service_id}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select sub service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {availableSubServices.map(subService => (
                              <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Judul Content */}
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs justify-start font-normal w-[150px] overflow-hidden"
                          onClick={() => {
                            setTitleText(plan.title || "");
                            setOpenTitleDialog(plan.id);
                          }}
                        >
                          {plan.title || "Click to add title"}
                        </Button>
                      </TableCell>
                      
                      {/* Content Pillar */}
                      <TableCell>
                        <Select
                          value={plan.content_pillar_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { 
                            content_pillar_id: value === "none" ? undefined : value 
                          })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select pillar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {contentPillars.map(pillar => (
                              <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Brief */}
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs justify-start font-normal w-[150px] truncate"
                          onClick={() => {
                            setBriefText(plan.brief || "");
                            setOpenBriefDialog(plan.id);
                          }}
                        >
                          {plan.brief || "Click to add brief"}
                        </Button>
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell>
                        <Select
                          value={plan.status || "none"}
                          onValueChange={(value) => handleStatusChange(plan.id, value === "none" ? "" : value)}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                            <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Revision */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{plan.revision_count}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleResetRevision(plan.id, 'revision_count')}
                          >
                            <RefreshCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      
                      {/* Approved */}
                      <TableCell>
                        <Checkbox 
                          checked={plan.approved}
                          onCheckedChange={(checked) => handleApprovalChange(plan.id, 'approved', !!checked)}
                        />
                      </TableCell>
                      
                      {/* Tanggal Selesai */}
                      <TableCell>
                        {plan.status === "Butuh Di Review" && plan.completion_date && (
                          <span className="text-xs">{formatDisplayDate(plan.completion_date, true)}</span>
                        )}
                      </TableCell>
                      
                      {/* Tanggal Upload (Mirror of Tanggal Posting) */}
                      <TableCell>
                        {plan.post_date && (
                          <span className="text-xs">{format(new Date(plan.post_date), 'dd MMM yyyy')}</span>
                        )}
                      </TableCell>
                      
                      {/* Tipe Content (Mirror) */}
                      <TableCell>
                        {contentTypes.find(type => type.id === plan.content_type_id)?.name || "-"}
                      </TableCell>
                      
                      {/* Judul Content (Mirror) */}
                      <TableCell>
                        <div className="truncate w-[150px]">
                          {plan.title || "-"}
                        </div>
                      </TableCell>
                      
                      {/* PIC Produksi */}
                      <TableCell>
                        <Select
                          value={plan.pic_production_id || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { 
                            pic_production_id: value === "none" ? undefined : value 
                          })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="Select person" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {getFilteredTeamMembers("Produksi").map(member => (
                              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Link Google Drive */}
                      <TableCell>
                        <LinkField 
                          value={plan.google_drive_link || ""}
                          onChange={(value) => handleLinkChange(plan.id, 'google_drive_link', value)}
                          placeholder="Add Google Drive link..."
                        />
                      </TableCell>
                      
                      {/* Status Produksi */}
                      <TableCell>
                        <Select
                          value={plan.production_status || "none"}
                          onValueChange={(value) => handleProductionStatusChange(plan.id, value === "none" ? "" : value)}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                            <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      {/* Revisi Counter (Production) */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{plan.production_revision_count}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleResetRevision(plan.id, 'production_revision_count')}
                          >
                            <RefreshCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      
                      {/* Tanggal Selesai Produksi */}
                      <TableCell>
                        {plan.production_status === "Butuh Di Review" && plan.production_completion_date && (
                          <span className="text-xs">{formatDisplayDate(plan.production_completion_date, true)}</span>
                        )}
                      </TableCell>
                      
                      {/* Approved (Production) */}
                      <TableCell>
                        <Checkbox 
                          checked={plan.production_approved}
                          onCheckedChange={(checked) => handleApprovalChange(plan.id, 'production_approved', !!checked)}
                        />
                      </TableCell>
                      
                      {/* Tanggal Approved */}
                      <TableCell>
                        {plan.production_approved && plan.production_approved_date && (
                          <span className="text-xs">{formatDisplayDate(plan.production_approved_date, true)}</span>
                        )}
                      </TableCell>
                      
                      {/* Download Link File (Mirror of Google Drive if approved) */}
                      <TableCell>
                        {plan.production_approved && plan.google_drive_link && (
                          <LinkField 
                            value={plan.google_drive_link}
                            onChange={(value) => handleLinkChange(plan.id, 'google_drive_link', value)}
                          />
                        )}
                      </TableCell>
                      
                      {/* Link Post */}
                      <TableCell>
                        <LinkField 
                          value={plan.post_link || ""}
                          onChange={(value) => handleLinkChange(plan.id, 'post_link', value)}
                          placeholder="Add post link..."
                        />
                      </TableCell>
                      
                      {/* Done */}
                      <TableCell>
                        <Checkbox 
                          checked={plan.done}
                          onCheckedChange={(checked) => updateContentPlan(plan.id, { done: !!checked })}
                        />
                      </TableCell>
                      
                      {/* Actual Post Date */}
                      <TableCell>
                        {plan.actual_post_date && (
                          <span className="text-xs">{format(new Date(plan.actual_post_date), 'dd MMM yyyy')}</span>
                        )}
                      </TableCell>
                      
                      {/* On Time Status */}
                      <TableCell>
                        {plan.on_time_status && (
                          <span className={`text-xs ${plan.on_time_status.includes("Late") ? "text-red-500" : "text-green-500"}`}>
                            {plan.on_time_status}
                          </span>
                        )}
                      </TableCell>
                      
                      {/* Status Content */}
                      <TableCell>
                        <Select
                          value={plan.status_content || "none"}
                          onValueChange={(value) => updateContentPlan(plan.id, { 
                            status_content: value === "none" ? undefined : value 
                          })}
                        >
                          <SelectTrigger className="w-[150px] h-7 text-xs">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="Recomended For Ads">Recomended For Ads</SelectItem>
                            <SelectItem value="Cancel">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
      
      {/* Brief Dialog */}
      <Dialog open={!!openBriefDialog} onOpenChange={(open) => !open && setOpenBriefDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Brief</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              value={briefText} 
              onChange={(e) => setBriefText(e.target.value)}
              placeholder="Enter brief details here..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenBriefDialog(null)}>Cancel</Button>
            <Button onClick={() => openBriefDialog && handleBriefSave(openBriefDialog)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Title Dialog */}
      <Dialog open={!!openTitleDialog} onOpenChange={(open) => !open && setOpenTitleDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              value={titleText} 
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Enter content title here..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTitleDialog(null)}>Cancel</Button>
            <Button onClick={() => openTitleDialog && handleTitleSave(openTitleDialog)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentTable;

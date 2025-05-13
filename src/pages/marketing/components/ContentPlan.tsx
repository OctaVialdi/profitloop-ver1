
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, RefreshCw, Calendar, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  useContentPlan, 
  ContentPlanItem 
} from '@/hooks/useContentPlan';

export const ContentPlan = () => {
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentContentPlanId, setCurrentContentPlanId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Get content planners (team members with department "Content Planner")
  const contentPlanners = getFilteredTeamMembers("Content Planner");
  
  // Get creative production staff (team members with department "Creative" and role "Produksi")
  const creativeProduction = teamMembers.filter(
    member => member.department === "Creative" && member.role === "Produksi"
  );

  const handleAddRow = async () => {
    const newContentPlan = {
      post_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      title: "",
      status: "",
      revision_count: 0,
      approved: false,
      production_status: "",
      production_revision_count: 0,
      production_approved: false,
      done: false
    };
    
    await addContentPlan(newContentPlan as Partial<ContentPlanItem>);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === contentPlans.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(contentPlans.map(plan => plan.id));
    }
  };

  const handleDeleteSelected = async () => {
    for (const rowId of selectedRows) {
      await deleteContentPlan(rowId);
    }
    setSelectedRows([]);
  };

  const openBriefDialog = (content: ContentPlanItem) => {
    setCurrentContentPlanId(content.id);
    setCurrentBrief(content.brief || "");
    setIsBriefDialogOpen(true);
  };

  const saveBrief = async () => {
    if (currentContentPlanId) {
      await updateContentPlan(currentContentPlanId, { 
        brief: currentBrief,
        status: "" // Reset status when brief changes
      });
      setIsBriefDialogOpen(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const updates: Partial<ContentPlanItem> = { status };
    
    // Set completion date if status is "Butuh Di Review"
    if (status === "Butuh Di Review") {
      updates.completion_date = new Date().toISOString();
    } else if (status === "") {
      updates.completion_date = null;
    }
    
    await updateContentPlan(id, updates);
  };

  const handleProductionStatusChange = async (id: string, status: string) => {
    const updates: Partial<ContentPlanItem> = { production_status: status };
    
    // Set production completion date if status is "Butuh Di Review"
    if (status === "Butuh Di Review") {
      updates.production_completion_date = new Date().toISOString();
    } else if (status === "") {
      updates.production_completion_date = null;
    }
    
    await updateContentPlan(id, updates);
  };

  const handleResetRevisionCounter = async (id: string, field: 'revision_count' | 'production_revision_count') => {
    await resetRevisionCounter(id, field);
  };

  const handleApprovalChange = async (id: string, approved: boolean) => {
    await updateContentPlan(id, { approved });
  };

  const handleProductionApprovalChange = async (id: string, approved: boolean) => {
    const updates: Partial<ContentPlanItem> = { 
      production_approved: approved
    };
    
    if (approved) {
      updates.production_approved_date = new Date().toISOString();
    } else {
      updates.production_approved_date = null;
    }
    
    await updateContentPlan(id, updates);
  };

  const handleDoneChange = async (id: string, done: boolean) => {
    await updateContentPlan(id, { done });
  };

  const handlePostLinkChange = async (id: string, postLink: string) => {
    const updates: Partial<ContentPlanItem> = { 
      post_link: postLink
    };
    
    if (postLink && postLink.trim() !== '') {
      updates.actual_post_date = new Date().toISOString();
    } else {
      updates.actual_post_date = null;
    }
    
    await updateContentPlan(id, updates);
  };

  const handleGoogleDriveLinkChange = async (id: string, link: string) => {
    await updateContentPlan(id, { 
      google_drive_link: link,
      production_status: "" // Reset production status when link changes
    });
  };

  const handleContentTypeChange = async (id: string, contentTypeId: string) => {
    await updateContentPlan(id, { content_type_id: contentTypeId });
  };

  const handleTitleChange = async (id: string, title: string) => {
    await updateContentPlan(id, { title });
  };

  const handlePICChange = async (id: string, picId: string) => {
    await updateContentPlan(id, { pic_id: picId });
  };

  const handleServiceChange = async (id: string, serviceId: string) => {
    await updateContentPlan(id, { 
      service_id: serviceId,
      sub_service_id: null  // Reset sub-service when service changes
    });
  };

  const handleSubServiceChange = async (id: string, subServiceId: string) => {
    await updateContentPlan(id, { sub_service_id: subServiceId });
  };

  const handleContentPillarChange = async (id: string, pillarId: string) => {
    await updateContentPlan(id, { content_pillar_id: pillarId });
  };

  const handlePICProductionChange = async (id: string, picId: string) => {
    await updateContentPlan(id, { pic_production_id: picId });
  };

  const handleStatusContentChange = async (id: string, status: string) => {
    await updateContentPlan(id, { status_content: status });
  };

  const handleDateChange = async (id: string, date: Date | undefined) => {
    if (date) {
      await updateContentPlan(id, { post_date: format(date, 'yyyy-MM-dd') });
    }
  };

  const getContentTypeName = (id: string | null) => {
    if (!id) return "-";
    const contentType = contentTypes.find(type => type.id === id);
    return contentType ? contentType.name : "-";
  };

  const getServiceName = (id: string | null) => {
    if (!id) return "-";
    const service = services.find(s => s.id === id);
    return service ? service.name : "-";
  };

  const getSubServiceName = (id: string | null) => {
    if (!id) return "-";
    const subService = subServices.find(s => s.id === id);
    return subService ? subService.name : "-";
  };

  const getPICName = (id: string | null) => {
    if (!id) return "-";
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : "-";
  };

  const getContentPillarName = (id: string | null) => {
    if (!id) return "-";
    const pillar = contentPillars.find(p => p.id === id);
    return pillar ? pillar.name : "-";
  };

  const formatDate = (dateString: string | null, includeTime: boolean = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return includeTime 
      ? format(date, "dd MMM yyyy - HH:mm")
      : format(date, "dd MMM yyyy");
  };

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Dashboard Content</h2>
          <div className="flex gap-2">
            {selectedRows.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            )}
            <Button size="sm" className="gap-1" onClick={handleAddRow}>
              <PlusIcon className="h-4 w-4" /> Add Row
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[500px] overflow-x-auto">
          <div className="min-w-max">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="text-center w-[50px]">
                    <Checkbox 
                      checked={selectedRows.length === contentPlans.length && contentPlans.length > 0} 
                      onCheckedChange={handleSelectAllRows}
                    />
                  </TableHead>
                  <TableHead className="text-center">Tanggal Posting</TableHead>
                  <TableHead className="text-center">Tipe Content</TableHead>
                  <TableHead className="text-center">PIC</TableHead>
                  <TableHead className="text-center">Layanan</TableHead>
                  <TableHead className="text-center">Sub Layanan</TableHead>
                  <TableHead className="text-center">Judul Content</TableHead>
                  <TableHead className="text-center">Content Pillar</TableHead>
                  <TableHead className="text-center">Brief</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Revision</TableHead>
                  <TableHead className="text-center">Approved</TableHead>
                  <TableHead className="text-center">Tanggal Selesai</TableHead>
                  <TableHead className="text-center">Tanggal Upload</TableHead>
                  <TableHead className="text-center">Tipe Content</TableHead>
                  <TableHead className="text-center">Judul Content</TableHead>
                  <TableHead className="text-center">PIC Produksi</TableHead>
                  <TableHead className="text-center">Link Google Drive</TableHead>
                  <TableHead className="text-center">Status Produksi</TableHead>
                  <TableHead className="text-center">Revisi Counter</TableHead>
                  <TableHead className="text-center">Tanggal Selesai Produksi</TableHead>
                  <TableHead className="text-center">Approved</TableHead>
                  <TableHead className="text-center">Tanggal Approved</TableHead>
                  <TableHead className="text-center">Download Link File</TableHead>
                  <TableHead className="text-center">Link Post</TableHead>
                  <TableHead className="text-center">Done</TableHead>
                  <TableHead className="text-center">Actual Post</TableHead>
                  <TableHead className="text-center">On Time Status</TableHead>
                  <TableHead className="text-center">Status Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={29} className="text-center py-4">
                      No content plans found. Click "Add Row" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  contentPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      {/* 1. Action */}
                      <TableCell className="py-2">
                        <Checkbox
                          checked={selectedRows.includes(plan.id)}
                          onCheckedChange={() => handleSelectRow(plan.id)}
                        />
                      </TableCell>

                      {/* 2. Tanggal Posting */}
                      <TableCell className="py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-[120px] justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              {plan.post_date ? formatDate(plan.post_date) : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={plan.post_date ? new Date(plan.post_date) : undefined}
                              onSelect={(date) => handleDateChange(plan.id, date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>

                      {/* 3. Tipe Content */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.content_type_id || ""} 
                          onValueChange={(value) => handleContentTypeChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {contentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 4. PIC */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.pic_id || ""} 
                          onValueChange={(value) => handlePICChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {contentPlanners.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 5. Layanan */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.service_id || ""} 
                          onValueChange={(value) => handleServiceChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 6. Sub Layanan */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.sub_service_id || ""} 
                          onValueChange={(value) => handleSubServiceChange(plan.id, value)}
                          disabled={!plan.service_id}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {plan.service_id && getFilteredSubServices(plan.service_id).map((subService) => (
                              <SelectItem key={subService.id} value={subService.id}>
                                {subService.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 7. Judul Content */}
                      <TableCell className="py-2">
                        <Input
                          value={plan.title || ""}
                          onChange={(e) => handleTitleChange(plan.id, e.target.value)}
                          className="max-w-[250px]"
                          title={plan.title || ""}
                        />
                      </TableCell>

                      {/* 8. Content Pillar */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.content_pillar_id || ""} 
                          onValueChange={(value) => handleContentPillarChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {contentPillars.map((pillar) => (
                              <SelectItem key={pillar.id} value={pillar.id}>
                                {pillar.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 9. Brief */}
                      <TableCell className="py-2 text-blue-500">
                        <Button
                          variant="ghost"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => openBriefDialog(plan)}
                        >
                          {plan.brief ? 
                            (plan.brief.length > 25 ? 
                              `${plan.brief.substring(0, 25)}...` : 
                              plan.brief) : 
                            "Click to add brief"}
                        </Button>
                      </TableCell>

                      {/* 10. Status */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.status || ""} 
                          onValueChange={(value) => handleStatusChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
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
                      <TableCell className="py-2">
                        <div className="flex items-center">
                          <span className="mr-1">{plan.revision_count}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleResetRevisionCounter(plan.id, 'revision_count')}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                      {/* 12. Approved */}
                      <TableCell className="py-2 text-center">
                        <Checkbox 
                          checked={plan.approved} 
                          onCheckedChange={(checked) => handleApprovalChange(plan.id, checked === true)}
                        />
                      </TableCell>

                      {/* 13. Tanggal Selesai */}
                      <TableCell className="py-2">
                        {plan.status === "Butuh Di Review" && plan.completion_date ? 
                          formatDate(plan.completion_date, true) : ""}
                      </TableCell>

                      {/* 14. Tanggal Upload (mirror dari Tanggal Posting) */}
                      <TableCell className="py-2">
                        {formatDate(plan.post_date)}
                      </TableCell>

                      {/* 15. Tipe Content (mirror dari Tipe Content) */}
                      <TableCell className="py-2">
                        {getContentTypeName(plan.content_type_id)}
                      </TableCell>

                      {/* 16. Judul Content (mirror dari Judul Content) */}
                      <TableCell className="py-2">
                        {plan.title || "-"}
                      </TableCell>

                      {/* 17. PIC Produksi */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.pic_production_id || ""} 
                          onValueChange={(value) => handlePICProductionChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            {creativeProduction.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 18. Link Google Drive */}
                      <TableCell className="py-2">
                        <Input
                          value={plan.google_drive_link || ""}
                          onChange={(e) => handleGoogleDriveLinkChange(plan.id, e.target.value)}
                          className="max-w-[250px]"
                          placeholder="Add Google Drive link"
                        />
                      </TableCell>

                      {/* 19. Status Produksi */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.production_status || ""} 
                          onValueChange={(value) => handleProductionStatusChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-</SelectItem>
                            <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                            <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* 20. Revisi Counter */}
                      <TableCell className="py-2">
                        <div className="flex items-center">
                          <span className="mr-1">{plan.production_revision_count}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleResetRevisionCounter(plan.id, 'production_revision_count')}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                      {/* 21. Tanggal Selesai Produksi */}
                      <TableCell className="py-2">
                        {plan.production_status === "Butuh Di Review" && plan.production_completion_date ? 
                          formatDate(plan.production_completion_date, true) : ""}
                      </TableCell>

                      {/* 22. Approved (Production) */}
                      <TableCell className="py-2 text-center">
                        <Checkbox 
                          checked={plan.production_approved} 
                          onCheckedChange={(checked) => handleProductionApprovalChange(plan.id, checked === true)}
                        />
                      </TableCell>

                      {/* 23. Tanggal Approved */}
                      <TableCell className="py-2">
                        {plan.production_approved && plan.production_approved_date ? 
                          formatDate(plan.production_approved_date, true) : ""}
                      </TableCell>

                      {/* 24. Download Link File (mirror dari Link Google Drive jika approved) */}
                      <TableCell className="py-2">
                        {plan.production_approved && plan.google_drive_link ? (
                          <a 
                            href={plan.google_drive_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            Download
                          </a>
                        ) : ""}
                      </TableCell>

                      {/* 25. Link Post */}
                      <TableCell className="py-2">
                        <Input
                          value={plan.post_link || ""}
                          onChange={(e) => handlePostLinkChange(plan.id, e.target.value)}
                          className="max-w-[250px]"
                          placeholder="Add post link"
                        />
                      </TableCell>

                      {/* 26. Done */}
                      <TableCell className="py-2 text-center">
                        <Checkbox 
                          checked={plan.done} 
                          onCheckedChange={(checked) => handleDoneChange(plan.id, checked === true)}
                        />
                      </TableCell>

                      {/* 27. Actual Post */}
                      <TableCell className="py-2">
                        {plan.actual_post_date ? formatDate(plan.actual_post_date, true) : ""}
                      </TableCell>

                      {/* 28. On Time Status */}
                      <TableCell className="py-2">
                        {plan.on_time_status || ""}
                      </TableCell>

                      {/* 29. Status Content */}
                      <TableCell className="py-2">
                        <Select 
                          value={plan.status_content || ""} 
                          onValueChange={(value) => handleStatusContentChange(plan.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
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
          </div>
        </ScrollArea>
      </div>

      {/* Brief Dialog */}
      <Dialog open={isBriefDialogOpen} onOpenChange={setIsBriefDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Content Brief</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brief">Brief Details</Label>
              <Textarea
                id="brief"
                value={currentBrief}
                onChange={(e) => setCurrentBrief(e.target.value)}
                rows={8}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBriefDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveBrief}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Edit, Trash2, RefreshCcw, Calendar, PlusSquare } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useContentManagement } from "@/hooks/useContentManagement";
import { ContentBriefDialog } from "@/components/marketing/content-bank/ContentBriefDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  isSelected?: boolean;
  postDate: string;
  contentType: string;
  pic: string;
  service: string;
  subService: string;
  title: string;
  contentPillar: string;
  brief: string;
  status: string;
  revisions: number;
  approved: boolean;
  completionDate: string | null;
}

const ContentBank = () => {
  const {
    contentTypes,
    services,
    subServices,
    contentPlanners,
    contentPillars,
    currentUser,
    getFilteredSubServices,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  } = useContentManagement();
  
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [activeBrief, setActiveBrief] = useState<{id: string, brief: string} | null>(null);
  const [showBriefDialog, setShowBriefDialog] = useState(false);
  const [briefLinkDialog, setBriefLinkDialog] = useState<{open: boolean, url: string}>({ open: false, url: "" });
  
  // Initialize with mock data and/or load from API
  useEffect(() => {
    const mockItems: ContentItem[] = [
      {
        id: "1",
        isSelected: false,
        postDate: "2025-05-15",
        contentType: contentTypes.length > 0 ? contentTypes[0].id : "",
        pic: contentPlanners.length > 0 ? contentPlanners[0].id : "",
        service: services.length > 0 ? services[0].id : "",
        subService: "",
        title: "Summer Collection Promo",
        contentPillar: contentPillars.length > 0 ? contentPillars[0].id : "",
        brief: "Create engaging content for summer collection",
        status: "none",
        revisions: 0,
        approved: false,
        completionDate: null
      },
      {
        id: "2",
        isSelected: false,
        postDate: "2025-05-18",
        contentType: contentTypes.length > 0 ? contentTypes[1]?.id || contentTypes[0].id : "",
        pic: contentPlanners.length > 0 ? contentPlanners[0].id : "",
        service: services.length > 0 ? services[0].id : "",
        subService: "",
        title: "Product Launch Announcement",
        contentPillar: contentPillars.length > 0 ? contentPillars[0].id : "",
        brief: "Details for upcoming product launch https://docs.google.com/document/d/abc123",
        status: "Butuh Di Review",
        revisions: 2,
        approved: false,
        completionDate: "2025-05-17T22:15:00"
      },
    ];
    
    setItems(mockItems);
  }, [contentTypes, contentPlanners, services, contentPillars]);
  
  const handleSelectAllChange = (checked: boolean) => {
    setAllSelected(checked);
    if (checked) {
      setSelectedItems(items.map(item => item.id));
      setItems(items.map(item => ({ ...item, isSelected: true })));
    } else {
      setSelectedItems([]);
      setItems(items.map(item => ({ ...item, isSelected: false })));
    }
  };
  
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      setAllSelected(false);
    }
    
    setItems(items.map(item => 
      item.id === id ? { ...item, isSelected: checked } : item
    ));
  };
  
  const handleAddRow = () => {
    const today = new Date();
    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      isSelected: false,
      postDate: format(today, "yyyy-MM-dd"),
      contentType: "",
      pic: "",
      service: "",
      subService: "",
      title: "",
      contentPillar: "",
      brief: "",
      status: "none",
      revisions: 0,
      approved: false,
      completionDate: null
    };
    
    setItems([newItem, ...items]);
    toast.success("New content row added");
  };
  
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }
    
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setAllSelected(false);
    toast.success(`${selectedItems.length} item(s) deleted`);
  };
  
  const handlePostDateChange = (id: string, date: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, postDate: date } : item
    ));
  };
  
  const handleContentTypeChange = (id: string, contentType: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, contentType } : item
    ));
  };
  
  const handlePicChange = (id: string, pic: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, pic } : item
    ));
  };
  
  const handleServiceChange = (id: string, service: string) => {
    // Reset subService when service changes
    setItems(items.map(item => 
      item.id === id ? { ...item, service, subService: "" } : item
    ));
  };
  
  const handleSubServiceChange = (id: string, subService: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, subService } : item
    ));
  };
  
  const handleTitleChange = (id: string, title: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, title } : item
    ));
  };
  
  const handleContentPillarChange = (id: string, contentPillar: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, contentPillar } : item
    ));
  };
  
  const handleBriefClick = (id: string, brief: string) => {
    setActiveBrief({id, brief});
    setShowBriefDialog(true);
  };
  
  const handleBriefSave = (id: string, brief: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // Reset status when brief is changed
        return { ...item, brief, status: "none" };
      }
      return item;
    }));
    
    setShowBriefDialog(false);
    setActiveBrief(null);
  };
  
  const handleStatusChange = (id: string, status: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let updatedItem = { ...item, status };
        
        // If status changed to "Butuh Di Review", set completion date
        if (status === "Butuh Di Review") {
          updatedItem.completionDate = new Date().toISOString();
        }
        
        // If status changed to "Request Revisi", increment revision counter
        if (status === "Request Revisi" && item.status !== "Request Revisi") {
          updatedItem.revisions = (item.revisions || 0) + 1;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };
  
  const handleResetRevisions = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, revisions: 0 } : item
    ));
  };
  
  const handleApproveChange = (id: string, approved: boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, approved } : item
    ));
  };
  
  const extractLinkFromBrief = (brief: string): string | null => {
    const googleDocsRegex = /https:\/\/docs\.google\.com\/\S+/;
    const match = brief.match(googleDocsRegex);
    return match ? match[0] : null;
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  
  const formatCompletionDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy - HH:mm");
  };
  
  // Get content type name for display
  const getContentTypeName = (id: string) => {
    const type = contentTypes.find(type => type.id === id);
    return type ? type.name : "";
  };
  
  // Get PIC name for display
  const getPICName = (id: string) => {
    const planner = contentPlanners.find(planner => planner.id === id);
    return planner ? planner.name : "";
  };
  
  // Get service name for display
  const getServiceName = (id: string) => {
    const service = services.find(service => service.id === id);
    return service ? service.name : "";
  };
  
  // Get sub-service name for display
  const getSubServiceName = (id: string) => {
    const subService = subServices.find(subService => subService.id === id);
    return subService ? subService.name : "";
  };
  
  // Get content pillar name for display
  const getContentPillarName = (id: string) => {
    const pillar = contentPillars.find(pillar => pillar.id === id);
    return pillar ? pillar.name : "";
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Bank</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search content..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddRow} className="flex items-center">
            <PlusSquare className="h-4 w-4 mr-1" />
            <span>Add Row</span>
          </Button>
          <Button variant="destructive" onClick={handleDeleteSelected} className="flex items-center">
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete Selected</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md h-[400px] overflow-hidden">
          {/* Fixed header */}
          <div className="w-[1800px]">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-[50px] text-center">
                    <Checkbox 
                      checked={allSelected && items.length > 0}
                      onCheckedChange={handleSelectAllChange}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[120px] text-center">Tanggal Posting</TableHead>
                  <TableHead className="w-[150px] text-center">Tipe Content</TableHead>
                  <TableHead className="w-[120px] text-center">PIC</TableHead>
                  <TableHead className="w-[150px] text-center">Layanan</TableHead>
                  <TableHead className="w-[150px] text-center">Sub Layanan</TableHead>
                  <TableHead className="w-[200px] text-center">Judul Content</TableHead>
                  <TableHead className="w-[150px] text-center">Content Pillar</TableHead>
                  <TableHead className="w-[150px] text-center">Brief</TableHead>
                  <TableHead className="w-[150px] text-center">Status</TableHead>
                  <TableHead className="w-[100px] text-center">Revision</TableHead>
                  <TableHead className="w-[100px] text-center">Approved</TableHead>
                  <TableHead className="w-[150px] text-center">Tanggal Selesai</TableHead>
                  <TableHead className="w-[120px] text-center">Tanggal Upload</TableHead>
                  <TableHead className="w-[150px] text-center">Tipe Content</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          
          {/* Scrollable body */}
          <div className="h-[calc(400px-40px)] overflow-hidden">
            <ScrollArea className="h-full" style={{ overflow: "auto" }}>
              <div className="min-w-[1800px]">
                <Table>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={item.isSelected} 
                            onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="date" 
                            value={item.postDate} 
                            onChange={(e) => handlePostDateChange(item.id, e.target.value)} 
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.contentType || "none"} 
                            onValueChange={(value) => handleContentTypeChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {contentTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.pic || "none"} 
                            onValueChange={(value) => handlePicChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {contentPlanners.map((planner) => (
                                <SelectItem key={planner.id} value={planner.id}>
                                  {planner.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.service || "none"} 
                            onValueChange={(value) => handleServiceChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.subService || "none"} 
                            onValueChange={(value) => handleSubServiceChange(item.id, value)}
                            disabled={!item.service}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.service && getFilteredSubServices(item.service).map((subService) => (
                                <SelectItem key={subService.id} value={subService.id}>
                                  {subService.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="w-full h-auto text-left justify-start px-2 py-1">
                                {truncateText(item.title, 25) || "Click to add title"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Content Title</h4>
                                <Textarea 
                                  value={item.title}
                                  onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                  placeholder="Enter content title"
                                  className="min-h-[100px]"
                                />
                                <div className="flex justify-end">
                                  <Button size="sm" onClick={() => {}}>Save</Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.contentPillar || "none"} 
                            onValueChange={(value) => handleContentPillarChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {contentPillars.map((pillar) => (
                                <SelectItem key={pillar.id} value={pillar.id}>
                                  {pillar.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            className="w-full h-auto text-left justify-start px-2 py-1"
                            onClick={() => handleBriefClick(item.id, item.brief)}
                          >
                            {truncateText(item.brief, 25) || "Click to add brief"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.status}
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
                              <SelectItem value="Request Revisi">Request Revisi</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span>{item.revisions}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleResetRevisions(item.id)}
                            >
                              <RefreshCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={item.approved} 
                            onCheckedChange={(checked) => handleApproveChange(item.id, !!checked)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                        <TableCell>
                          {item.status === "Butuh Di Review" ? (
                            formatCompletionDate(item.completionDate)
                          ) : ""}
                        </TableCell>
                        <TableCell>
                          {item.postDate}
                        </TableCell>
                        <TableCell>
                          {getContentTypeName(item.contentType)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      
      {/* Brief Dialog */}
      {showBriefDialog && activeBrief && (
        <Dialog open={showBriefDialog} onOpenChange={setShowBriefDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Content Brief</DialogTitle>
              <DialogDescription>
                Enter details for this content. If you include a Google Docs link, it will be automatically detected.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea 
                value={activeBrief.brief}
                onChange={(e) => setActiveBrief({...activeBrief, brief: e.target.value})}
                placeholder="Enter brief details or paste a Google Docs link"
                className="min-h-[200px]"
              />
              
              {extractLinkFromBrief(activeBrief.brief) && (
                <Button 
                  variant="outline"
                  onClick={() => setBriefLinkDialog({ 
                    open: true, 
                    url: extractLinkFromBrief(activeBrief.brief)! 
                  })}
                >
                  Open Document
                </Button>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBriefDialog(false)}>Cancel</Button>
              <Button onClick={() => handleBriefSave(activeBrief.id, activeBrief.brief)}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Google Docs Link Dialog */}
      <Dialog open={briefLinkDialog.open} onOpenChange={(open) => setBriefLinkDialog({...briefLinkDialog, open})}>
        <DialogContent className="sm:max-w-[800px] sm:h-[600px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[500px]">
            <iframe 
              src={briefLinkDialog.url} 
              className="w-full h-full border-none"
              title="Google Document Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentBank;

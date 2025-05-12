
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/services/employeeService";
import { convertToLegacyFormat } from "@/hooks/useEmployees";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ContentPlan = () => {
  const isMobile = useIsMobile();
  
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
    getFilteredSubServices
  } = useContentManagement();
  
  const { employees } = useEmployees();
  const [isManager, setIsManager] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  
  // Check if current user is a manager in Digital Marketing
  useEffect(() => {
    const currentUser = employees.find(emp => {
      const legacyEmp = convertToLegacyFormat(emp);
      return legacyEmp.organization === "Digital Marketing" && 
             legacyEmp.jobPosition?.toLowerCase().includes("manager");
    });
    
    setIsManager(!!currentUser);
  }, [employees]);
  
  // Brief dialog state
  const [briefOpen, setBriefOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string>("");
  const [briefContent, setBriefContent] = useState("");
  
  // Title dialog state
  const [titleOpen, setTitleOpen] = useState(false);
  const [titleContent, setTitleContent] = useState("");
  
  const handleAddRow = () => {
    addContentItem();
    toast.success("New content item added");
  };
  
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected for deletion");
      return;
    }
    
    deleteContentItems(selectedItems);
    setSelectedItems([]);
    setAllSelected(false);
    toast.success(`Deleted ${selectedItems.length} item(s)`);
  };
  
  const toggleItemSelection = (id: string) => {
    toggleSelectItem(id);
    
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleSelectAll = () => {
    const newState = !allSelected;
    setAllSelected(newState);
    selectAllItems(newState);
    
    if (newState) {
      setSelectedItems(contentItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const openBriefDialog = (id: string, content: string = "") => {
    setCurrentItemId(id);
    setBriefContent(content || "");
    setBriefOpen(true);
  };
  
  const saveBrief = () => {
    updateContentItem(currentItemId, { 
      brief: briefContent,
      status: "none" // Reset status when brief is changed
    });
    setBriefOpen(false);
    toast.success("Brief updated");
  };
  
  const openTitleDialog = (id: string, title: string = "") => {
    setCurrentItemId(id);
    setTitleContent(title || "");
    setTitleOpen(true);
  };
  
  const saveTitle = () => {
    updateContentItem(currentItemId, { title: titleContent });
    setTitleOpen(false);
    toast.success("Title updated");
  };
  
  const resetRevisionCounter = (id: string) => {
    updateContentItem(id, { revisionCount: 0 });
    toast.success("Revision counter reset");
  };
  
  const formatBriefText = (text: string) => {
    if (!text) return "Click to add brief";
    
    // Truncate to 25 chars
    if (text.length > 25) {
      return text.substring(0, 25) + "...";
    }
    return text;
  };
  
  const formatTitleText = (text: string) => {
    if (!text) return "Click to add title";
    
    // Truncate to 25 chars
    if (text.length > 25) {
      return text.substring(0, 25) + "...";
    }
    return text;
  };
  
  // Check if string is a Google Docs link
  const isGoogleDocsLink = (text: string) => {
    return text.includes("docs.google.com");
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Content Plan</CardTitle>
        <div className="flex gap-2">
          {isManager && selectedItems.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
          )}
          <Button size="sm" onClick={handleAddRow}>Add Row</Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fixed height container to prevent page size changes */}
        <div className="w-full" style={{ minHeight: isMobile ? '500px' : '600px' }}>
          <div className="rounded-md border h-full">
            <div className="relative h-full flex flex-col">
              <ScrollArea className="flex-1" style={{ height: isMobile ? '500px' : 'calc(100vh - 350px)' }}>
                {isMobile ? (
                  // Mobile view - simplified table with fewer columns
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        {isManager && (
                          <TableHead className="w-[40px] text-center">
                            <input 
                              type="checkbox" 
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </TableHead>
                        )}
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Brief</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentItems.length === 0 ? (
                        <TableRow>
                          <TableHead colSpan={isManager ? 5 : 4} className="text-center h-32 text-muted-foreground">
                            No content items yet. Click "Add Row" to create one.
                          </TableHead>
                        </TableRow>
                      ) : (
                        contentItems.map((item) => (
                          <TableRow key={item.id}>
                            {isManager && (
                              <TableHead className="text-center">
                                <input 
                                  type="checkbox" 
                                  checked={!!item.isSelected}
                                  onChange={() => toggleItemSelection(item.id)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </TableHead>
                            )}
                            <TableHead>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full justify-start text-left font-normal text-xs"
                                  >
                                    <CalendarIcon className="mr-1 h-3 w-3" />
                                    {item.postDate ? format(new Date(item.postDate), "dd MMM") : "Select"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={item.postDate ? new Date(item.postDate) : undefined}
                                    onSelect={(date) => updateContentItem(item.id, { postDate: date?.toISOString() })}
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </TableHead>
                            <TableHead>
                              <Button 
                                variant="ghost" 
                                className="w-full text-left justify-start h-auto py-1 px-2 text-xs"
                                onClick={() => openTitleDialog(item.id, item.title)}
                              >
                                <span className="truncate block">
                                  {formatTitleText(item.title)}
                                </span>
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button 
                                variant="ghost" 
                                className="w-full text-left justify-start h-auto py-1 px-2 text-xs"
                                onClick={() => openBriefDialog(item.id, item.brief)}
                              >
                                <span className="truncate block">
                                  {formatBriefText(item.brief)}
                                </span>
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.status || "none"}
                                onValueChange={(value) => updateContentItem(item.id, { status: value })}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  <SelectItem value="review">Review</SelectItem>
                                  <SelectItem value="revisi">Revisi</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableHead>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  // Desktop view - full table with all columns and fixed layout
                  <Table className="table-fixed">
                    <TableHeader className="sticky top-0 bg-white z-30">
                      <TableRow>
                        {isManager && (
                          <TableHead className="w-[50px] text-center">
                            <input 
                              type="checkbox" 
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </TableHead>
                        )}
                        <TableHead className="w-[120px]">Tanggal Posting</TableHead>
                        <TableHead className="w-[150px]">Tipe Content</TableHead>
                        <TableHead className="w-[120px]">PIC</TableHead>
                        <TableHead className="w-[150px]">Layanan</TableHead>
                        <TableHead className="w-[150px]">Sub Layanan</TableHead>
                        <TableHead className="w-[180px]">Judul Content</TableHead>
                        <TableHead className="w-[150px]">Content Pillar</TableHead>
                        <TableHead className="w-[150px]">Brief</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[100px]">Revision</TableHead>
                        <TableHead className="w-[100px]">Approved</TableHead>
                        <TableHead className="w-[150px]">Tanggal Selesai</TableHead>
                        <TableHead className="w-[120px]">Tanggal Upload</TableHead>
                        <TableHead className="w-[150px]">Tipe Content</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentItems.length === 0 ? (
                        <TableRow>
                          <TableHead colSpan={isManager ? 15 : 14} className="text-center h-32 text-muted-foreground">
                            No content items yet. Click "Add Row" to create one.
                          </TableHead>
                        </TableRow>
                      ) : (
                        contentItems.map((item) => (
                          <TableRow key={item.id}>
                            {isManager && (
                              <TableHead className="text-center">
                                <input 
                                  type="checkbox" 
                                  checked={!!item.isSelected}
                                  onChange={() => toggleItemSelection(item.id)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                              </TableHead>
                            )}
                            <TableHead>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {item.postDate ? format(new Date(item.postDate), "dd MMM yyyy") : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={item.postDate ? new Date(item.postDate) : undefined}
                                    onSelect={(date) => updateContentItem(item.id, { postDate: date?.toISOString() })}
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.contentType || ""}
                                onValueChange={(value) => updateContentItem(item.id, { contentType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {contentTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.pic || ""}
                                onValueChange={(value) => updateContentItem(item.id, { pic: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {contentPlanners.map(planner => (
                                    <SelectItem key={planner.id} value={planner.id}>{planner.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.service || ""}
                                onValueChange={(value) => {
                                  // Reset sub service when service changes
                                  updateContentItem(item.id, { service: value, subService: "" });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {services.map(service => (
                                    <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.subService || ""}
                                onValueChange={(value) => updateContentItem(item.id, { subService: value })}
                                disabled={!item.service}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {item.service && getFilteredSubServices(item.service).map(subService => (
                                    <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead>
                              <Button 
                                variant="ghost" 
                                className="w-full text-left justify-start h-auto py-1 px-2"
                                onClick={() => openTitleDialog(item.id, item.title)}
                              >
                                <span className="truncate block">
                                  {formatTitleText(item.title)}
                                </span>
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.contentPillar || ""}
                                onValueChange={(value) => updateContentItem(item.id, { contentPillar: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {contentPillars.map(pillar => (
                                    <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead>
                              <Button 
                                variant="ghost" 
                                className="w-full text-left justify-start h-auto py-1 px-2"
                                onClick={() => openBriefDialog(item.id, item.brief)}
                              >
                                <span className="truncate block">
                                  {formatBriefText(item.brief)}
                                </span>
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Select
                                value={item.status || "none"}
                                onValueChange={(value) => updateContentItem(item.id, { status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  <SelectItem value="review">Butuh Di Review</SelectItem>
                                  <SelectItem value="revisi">Request Revisi</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableHead>
                            <TableHead className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span>{item.revisionCount || 0}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => resetRevisionCounter(item.id)}
                                >
                                  <RefreshCcw className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableHead>
                            <TableHead className="text-center">
                              <input 
                                type="checkbox" 
                                checked={!!item.isApproved}
                                onChange={() => updateContentItem(item.id, { isApproved: !item.isApproved })}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableHead>
                            <TableHead className="text-center">
                              {item.status === "review" && item.completionDate && 
                                format(new Date(item.completionDate), "dd MMM yyyy - HH:mm")}
                            </TableHead>
                            <TableHead className="text-center">
                              {item.postDate && format(new Date(item.postDate), "dd MMM yyyy")}
                            </TableHead>
                            <TableHead>
                              {item.contentType && contentTypes.find(type => type.id === item.contentType)?.name}
                            </TableHead>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Brief Dialog */}
      <Dialog open={briefOpen} onOpenChange={setBriefOpen}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'sm:max-w-[500px]'}`}>
          <DialogHeader>
            <DialogTitle>Edit Brief</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={briefContent}
              onChange={(e) => setBriefContent(e.target.value)}
              placeholder="Enter brief content"
              rows={10}
              className="resize-none"
            />
            {isGoogleDocsLink(briefContent) && (
              <div className={`border rounded-md p-4 ${isMobile ? 'h-60' : 'h-80'}`}>
                <iframe 
                  src={briefContent.includes('?') ? `${briefContent}&embedded=true` : `${briefContent}?embedded=true`}
                  title="Google Doc Preview"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBriefOpen(false)}>Cancel</Button>
            <Button onClick={saveBrief}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Title Dialog */}
      <Dialog open={titleOpen} onOpenChange={setTitleOpen}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'sm:max-w-[500px]'}`}>
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={titleContent}
              onChange={(e) => setTitleContent(e.target.value)}
              placeholder="Enter content title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTitleOpen(false)}>Cancel</Button>
            <Button onClick={saveTitle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentPlan;

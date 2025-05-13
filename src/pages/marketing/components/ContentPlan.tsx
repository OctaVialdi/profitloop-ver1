import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useContentPlan } from "@/hooks/useContentPlan";
import { ContentPlanItem } from "@/hooks/content-plan/types";

export default function ContentPlan() {
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
    getFilteredSubServices,
    formatDisplayDate,
    getContentPlanners,
    getCreativeTeamMembers
  } = useContentPlan();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPlan, setSelectedPlan] = useState<ContentPlanItem | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [filteredSubServices, setFilteredSubServices] = useState(subServices);

  // Form states
  const [formValues, setFormValues] = useState({
    title: '',
    content_type_id: '',
    pic_id: '',
    service_id: '',
    sub_service_id: '',
    content_pillar_id: '',
    brief: '',
    pic_production_id: ''
  });

  useEffect(() => {
    if (selectedService) {
      setFilteredSubServices(getFilteredSubServices(selectedService));
    }
  }, [selectedService, getFilteredSubServices]);

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setFormValues(prev => ({ ...prev, service_id: value, sub_service_id: '' }));
  };

  const resetForm = () => {
    setFormValues({
      title: '',
      content_type_id: '',
      pic_id: '',
      service_id: '',
      sub_service_id: '',
      content_pillar_id: '',
      brief: '',
      pic_production_id: ''
    });
    setSelectedDate(new Date());
    setSelectedService('');
  };

  const handleAddContentPlan = async () => {
    try {
      const postDate = format(selectedDate, 'yyyy-MM-dd');
      const newPlan = { ...formValues, post_date: postDate };
      await addContentPlan(newPlan);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding content plan:", error);
    }
  };

  const handleEditContentPlan = async () => {
    if (!selectedPlan) return;
    
    try {
      const postDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : selectedPlan.post_date;
      const updatedPlan = { ...formValues, post_date: postDate };
      await updateContentPlan(selectedPlan.id, updatedPlan);
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      resetForm();
    } catch (error) {
      console.error("Error updating content plan:", error);
    }
  };

  const openEditModal = (plan: ContentPlanItem) => {
    setSelectedPlan(plan);
    setFormValues({
      title: plan.title || '',
      content_type_id: plan.content_type_id || '',
      pic_id: plan.pic_id || '',
      service_id: plan.service_id || '',
      sub_service_id: plan.sub_service_id || '',
      content_pillar_id: plan.content_pillar_id || '',
      brief: plan.brief || '',
      pic_production_id: plan.pic_production_id || ''
    });
    if (plan.post_date) {
      setSelectedDate(new Date(plan.post_date));
    }
    if (plan.service_id) {
      setSelectedService(plan.service_id);
    }
    setIsEditModalOpen(true);
  };

  const contentPlanners = getContentPlanners();
  const creativeTeamMembers = getCreativeTeamMembers();

  const renderContentForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="post_date">Post Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content_type">Content Type</Label>
          <Select 
            value={formValues.content_type_id}
            onValueChange={(value) => setFormValues(prev => ({ ...prev, content_type_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {contentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pic">PIC (Content Planner)</Label>
          <Select 
            value={formValues.pic_id}
            onValueChange={(value) => setFormValues(prev => ({ ...prev, pic_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {contentPlanners.map((member) => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pic_production">PIC Production (Creative)</Label>
          <Select 
            value={formValues.pic_production_id}
            onValueChange={(value) => setFormValues(prev => ({ ...prev, pic_production_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Production PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {creativeTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Select 
            value={formValues.service_id}
            onValueChange={handleServiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub_service">Sub Service</Label>
          <Select 
            value={formValues.sub_service_id}
            onValueChange={(value) => setFormValues(prev => ({ ...prev, sub_service_id: value }))}
            disabled={!selectedService}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filteredSubServices.map((subService) => (
                  <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_pillar">Content Pillar</Label>
        <Select 
          value={formValues.content_pillar_id}
          onValueChange={(value) => setFormValues(prev => ({ ...prev, content_pillar_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content pillar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {contentPillars.map((pillar) => (
                <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={formValues.title}
          onChange={(e) => setFormValues(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter content title" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brief">Brief</Label>
        <Textarea 
          id="brief" 
          value={formValues.brief || ''}
          onChange={(e) => setFormValues(prev => ({ ...prev, brief: e.target.value }))}
          placeholder="Enter content brief" 
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Plan</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content Plan
            </Button>

            <div className="mt-4">
              {contentPlans.length > 0 ? (
                <ul>
                  {contentPlans.map((plan) => (
                    <li key={plan.id} className="mb-2 border p-2 rounded-md">
                      <div className="font-bold">{plan.title}</div>
                      <div className="text-sm">
                        Date: {formatDisplayDate(plan.post_date)}
                      </div>
                      <Button onClick={() => openEditModal(plan)}>Edit</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No content plans found.</div>
              )}
            </div>

            {/* Add Content Plan Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Add Content Plan</DialogTitle>
                </DialogHeader>
                {renderContentForm()}
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddContentPlan}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Content Plan Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Edit Content Plan</DialogTitle>
                </DialogHeader>
                {renderContentForm()}
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleEditContentPlan}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}

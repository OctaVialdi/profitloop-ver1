
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkExperience {
  id?: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: Date | null;
  endDate: Date | null;
  jobDescription?: string;
}

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperience[]>>;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ workExperience, setWorkExperience }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    companyName: "",
    position: "",
    location: "",
    startDate: null,
    endDate: null,
    jobDescription: ""
  });

  const openAddDialog = () => {
    setCurrentExperience({
      companyName: "",
      position: "",
      location: "",
      startDate: null,
      endDate: null,
      jobDescription: ""
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setCurrentExperience({ ...workExperience[index] });
    setEditIndex(index);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!currentExperience.companyName || !currentExperience.position) {
      return;
    }

    if (isEditing) {
      const updatedExperience = [...workExperience];
      updatedExperience[editIndex] = currentExperience;
      setWorkExperience(updatedExperience);
    } else {
      setWorkExperience([...workExperience, currentExperience]);
    }

    setIsDialogOpen(false);
  };

  const formatExperienceDate = (date: Date | null) => {
    if (!date) return "-";
    return format(date, "MMM yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Work Experience</h3>
          <p className="text-sm text-muted-foreground">Add your previous work experience.</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {workExperience.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workExperience.map((experience, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{experience.companyName}</TableCell>
                  <TableCell>{experience.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{experience.location || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatExperienceDate(experience.startDate)} - {formatExperienceDate(experience.endDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(index)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(index)}>
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No work experience added yet.</p>
          <Button variant="outline" className="mt-4" onClick={openAddDialog}>
            Add Your First Work Experience
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"} Work Experience</DialogTitle>
            <DialogDescription>
              Enter the details of your work experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="required">Company Name</Label>
                <Input
                  id="companyName"
                  value={currentExperience.companyName}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="required">Position</Label>
                <Input
                  id="position"
                  value={currentExperience.position}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                  placeholder="Enter your job position/title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={currentExperience.location}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                  placeholder="Enter location (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !currentExperience.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentExperience.startDate ? format(currentExperience.startDate, "MMM yyyy") : <span>Start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentExperience.startDate || undefined}
                        onSelect={(date) => setCurrentExperience({ ...currentExperience, startDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !currentExperience.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentExperience.endDate ? format(currentExperience.endDate, "MMM yyyy") : <span>End date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentExperience.endDate || undefined}
                        onSelect={(date) => setCurrentExperience({ ...currentExperience, endDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={currentExperience.jobDescription}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, jobDescription: e.target.value })}
                  placeholder="Describe your responsibilities and achievements (optional)"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {isEditing ? "Update" : "Add"} Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

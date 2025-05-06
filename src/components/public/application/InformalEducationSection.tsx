
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

interface InformalEducation {
  id?: string;
  courseName: string;
  provider: string;
  certificationField: string;
  certificateNumber?: string;
  startDate: Date | null;
  endDate: Date | null;
  description?: string;
}

interface InformalEducationSectionProps {
  informalEducation: InformalEducation[];
  setInformalEducation: React.Dispatch<React.SetStateAction<InformalEducation[]>>;
}

export const InformalEducationSection: React.FC<InformalEducationSectionProps> = ({ informalEducation, setInformalEducation }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [currentEducation, setCurrentEducation] = useState<InformalEducation>({
    courseName: "",
    provider: "",
    certificationField: "",
    certificateNumber: "",
    startDate: null,
    endDate: null,
    description: ""
  });

  const openAddDialog = () => {
    setCurrentEducation({
      courseName: "",
      provider: "",
      certificationField: "",
      certificateNumber: "",
      startDate: null,
      endDate: null,
      description: ""
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setCurrentEducation({ ...informalEducation[index] });
    setEditIndex(index);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setInformalEducation(informalEducation.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!currentEducation.courseName || !currentEducation.provider || !currentEducation.certificationField) {
      return;
    }

    if (isEditing) {
      const updatedEducation = [...informalEducation];
      updatedEducation[editIndex] = currentEducation;
      setInformalEducation(updatedEducation);
    } else {
      setInformalEducation([...informalEducation, currentEducation]);
    }

    setIsDialogOpen(false);
  };

  const formatEducationDate = (date: Date | null) => {
    if (!date) return "-";
    return format(date, "MMM yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Informal Education</h3>
          <p className="text-sm text-muted-foreground">Add your courses, certifications, and training programs.</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {informalEducation.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead className="hidden md:table-cell">Field</TableHead>
                <TableHead className="hidden md:table-cell">Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {informalEducation.map((education, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{education.courseName}</TableCell>
                  <TableCell>{education.provider}</TableCell>
                  <TableCell className="hidden md:table-cell">{education.certificationField}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatEducationDate(education.startDate)} - {formatEducationDate(education.endDate)}
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
          <p className="text-muted-foreground">No certifications or courses added yet.</p>
          <Button variant="outline" className="mt-4" onClick={openAddDialog}>
            Add Your First Certification
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"} Certification/Course</DialogTitle>
            <DialogDescription>
              Enter the details of your certification or course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName" className="required">Course Name</Label>
                <Input
                  id="courseName"
                  value={currentEducation.courseName}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, courseName: e.target.value })}
                  placeholder="Enter course or certification name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider" className="required">Provider</Label>
                <Input
                  id="provider"
                  value={currentEducation.provider}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, provider: e.target.value })}
                  placeholder="Enter provider or issuing organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificationField" className="required">Certification Field</Label>
                <Input
                  id="certificationField"
                  value={currentEducation.certificationField}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, certificationField: e.target.value })}
                  placeholder="Enter field of certification"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  value={currentEducation.certificateNumber}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, certificateNumber: e.target.value })}
                  placeholder="Enter certificate number (optional)"
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
                          !currentEducation.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentEducation.startDate ? format(currentEducation.startDate, "MMM yyyy") : <span>Start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentEducation.startDate || undefined}
                        onSelect={(date) => setCurrentEducation({ ...currentEducation, startDate: date })}
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
                          !currentEducation.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentEducation.endDate ? format(currentEducation.endDate, "MMM yyyy") : <span>End date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentEducation.endDate || undefined}
                        onSelect={(date) => setCurrentEducation({ ...currentEducation, endDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentEducation.description}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
                  placeholder="Enter additional information (optional)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {isEditing ? "Update" : "Add"} Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

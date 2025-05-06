
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

interface FormalEducation {
  id?: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | null;
  endDate: Date | null;
  grade?: string;
  description?: string;
}

interface FormalEducationSectionProps {
  formalEducation: FormalEducation[];
  setFormalEducation: React.Dispatch<React.SetStateAction<FormalEducation[]>>;
}

export const FormalEducationSection: React.FC<FormalEducationSectionProps> = ({ formalEducation, setFormalEducation }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [currentEducation, setCurrentEducation] = useState<FormalEducation>({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: null,
    endDate: null,
    grade: "",
    description: ""
  });

  const openAddDialog = () => {
    setCurrentEducation({
      institutionName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null,
      endDate: null,
      grade: "",
      description: ""
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setCurrentEducation({ ...formalEducation[index] });
    setEditIndex(index);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setFormalEducation(formalEducation.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!currentEducation.institutionName || !currentEducation.degree || !currentEducation.fieldOfStudy) {
      return;
    }

    if (isEditing) {
      const updatedEducation = [...formalEducation];
      updatedEducation[editIndex] = currentEducation;
      setFormalEducation(updatedEducation);
    } else {
      setFormalEducation([...formalEducation, currentEducation]);
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
          <h3 className="text-lg font-medium">Formal Education</h3>
          <p className="text-sm text-muted-foreground">Add your educational background information.</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {formalEducation.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead className="hidden md:table-cell">Field of Study</TableHead>
                <TableHead className="hidden md:table-cell">Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formalEducation.map((education, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{education.institutionName}</TableCell>
                  <TableCell>{education.degree}</TableCell>
                  <TableCell className="hidden md:table-cell">{education.fieldOfStudy}</TableCell>
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
          <p className="text-muted-foreground">No formal education added yet.</p>
          <Button variant="outline" className="mt-4" onClick={openAddDialog}>
            Add Your Educational Background
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"} Formal Education</DialogTitle>
            <DialogDescription>
              Enter the details of your educational background.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName" className="required">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={currentEducation.institutionName}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, institutionName: e.target.value })}
                  placeholder="Enter institution name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree" className="required">Degree</Label>
                <Input
                  id="degree"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                  placeholder="Enter degree (e.g., Bachelor of Science)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy" className="required">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={currentEducation.fieldOfStudy}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, fieldOfStudy: e.target.value })}
                  placeholder="Enter field of study"
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
                <Label htmlFor="grade">Grade/GPA</Label>
                <Input
                  id="grade"
                  value={currentEducation.grade}
                  onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
                  placeholder="Enter your grade/GPA (optional)"
                />
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
              {isEditing ? "Update" : "Add"} Education
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

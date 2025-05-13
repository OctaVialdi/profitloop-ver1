
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentManager } from "../../types/socialMedia";

interface EditTargetDialogProps {
  isEditTargetOpen: boolean;
  setIsEditTargetOpen: (isOpen: boolean) => void;
  selectedMonth: Date;
  targetValue: string;
  setTargetValue: (value: string) => void;
  handleSaveTarget: () => void;
  editingManager: ContentManager | null;
}

const EditTargetDialog: React.FC<EditTargetDialogProps> = ({
  isEditTargetOpen,
  setIsEditTargetOpen,
  selectedMonth,
  targetValue,
  setTargetValue,
  handleSaveTarget,
  editingManager,
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Dialog open={isEditTargetOpen} onOpenChange={setIsEditTargetOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Target for {format(selectedMonth, "MMMM yyyy")}
          </DialogTitle>
          <button 
            onClick={() => setIsEditTargetOpen(false)} 
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="month" className="text-base font-medium">Month</label>
            <Select value={format(selectedMonth, "MMMM yyyy")}>
              <SelectTrigger className="w-full">
                <SelectValue>{format(selectedMonth, "MMMM yyyy")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={`${month} ${selectedMonth.getFullYear()}`}>
                      {month} {selectedMonth.getFullYear()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="target" className="text-base font-medium">Target Value</label>
            <Input 
              id="target" 
              type="number" 
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsEditTargetOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-purple-500 hover:bg-purple-600 text-white" 
            onClick={handleSaveTarget}
          >
            Save Target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTargetDialog;

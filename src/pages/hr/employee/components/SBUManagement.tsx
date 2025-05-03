
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SBUItem } from "../types";

interface SBUManagementProps {
  sbuList: SBUItem[];
  handleAddSBU: () => void;
  handleRemoveSBU: (index: number) => void;
  handleSaveSBU: (index: number, group: string, name: string) => void;
}

export const SBUManagement: React.FC<SBUManagementProps> = ({
  sbuList,
  handleAddSBU,
  handleRemoveSBU,
  handleSaveSBU,
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="sbu">SBU</Label>
      
      {/* SBU List */}
      {sbuList.map((sbu, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="grid grid-cols-2 gap-2 flex-grow">
            <Select 
              value={sbu.group}
              onValueChange={(value) => handleSaveSBU(index, value, sbu.name)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select SBU Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group1">SBU Group 1</SelectItem>
                <SelectItem value="group2">SBU Group 2</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={sbu.name}
              onValueChange={(value) => handleSaveSBU(index, sbu.group, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select SBU" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sbu1">SBU 1</SelectItem>
                <SelectItem value="sbu2">SBU 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="shrink-0 mt-0"
            onClick={() => handleRemoveSBU(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {/* Add SBU Button */}
      <Button 
        type="button" 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={handleAddSBU}
      >
        <Plus className="h-4 w-4" /> Add SBU
      </Button>
    </div>
  );
};

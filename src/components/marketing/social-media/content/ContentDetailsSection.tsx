
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentPillar } from "@/types/contentManagement";

interface ContentDetailsSectionProps {
  item: {
    id: string;
    contentPillar: string;
    brief: string;
    status: string;
    revisionCount: number;
    isApproved: boolean;
    completionDate?: string;
  };
  contentPillars: ContentPillar[];
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  handleContentPillarChange: (itemId: string, pillarId: string) => void;
  handleStatusChange: (itemId: string, status: string) => void;
  resetRevisionCounter: (itemId: string) => void;
  toggleApproval: (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => void;
  displayBrief: (brief: string) => string;
  formatDisplayDate: (dateString: string | undefined) => string;
}

export const ContentDetailsSection: React.FC<ContentDetailsSectionProps> = ({
  item,
  contentPillars,
  openBriefDialog,
  handleContentPillarChange,
  handleStatusChange,
  resetRevisionCounter,
  toggleApproval,
  displayBrief,
  formatDisplayDate,
}) => {
  return (
    <>
      <TableCell className="p-2">
        <Select 
          value={item.contentPillar} 
          onValueChange={(value) => handleContentPillarChange(item.id, value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select content pillar" />
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
      <TableCell className="p-2">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={() => openBriefDialog(item.id, item.brief, item.brief ? "view" : "edit")}
        >
          <FileText className="mr-2 h-4 w-4" />
          {item.brief ? displayBrief(item.brief) : 'Click to add brief'}
        </Button>
      </TableCell>
      <TableCell className="p-2">
        <Select 
          value={item.status} 
          onValueChange={(value) => handleStatusChange(item.id, value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            <SelectItem value="review">Butuh Di Review</SelectItem>
            <SelectItem value="revision">Request Revisi</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span>{item.revisionCount || 0}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => resetRevisionCounter(item.id)}
            className="h-6 w-6"
          >
            <RefreshCcw className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="p-2 text-center">
        <Checkbox 
          checked={item.isApproved}
          onCheckedChange={(checked) => {
            if (checked) {
              toggleApproval(item.id, true, "isApproved");
            }
          }}
          disabled={item.isApproved} // Once checked, it can't be unchecked
        />
      </TableCell>
      <TableCell className="p-2">
        {item.status === "review" && item.completionDate ? (
          <div className="text-center">
            {formatDisplayDate(item.completionDate)}
          </div>
        ) : null}
      </TableCell>
    </>
  );
};

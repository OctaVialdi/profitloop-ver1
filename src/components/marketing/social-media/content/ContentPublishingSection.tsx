
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentItem } from "@/types/contentManagement";

interface ContentPublishingSectionProps {
  item: ContentItem;
  openLinkDialog: (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => void;
  handleDoneStatusChange: (itemId: string, isDone: boolean) => void;
  handleContentStatusChange: (itemId: string, status: string) => void;
  formatDisplayDate: (dateString: string | undefined) => string;
}

export const ContentPublishingSection: React.FC<ContentPublishingSectionProps> = ({
  item,
  openLinkDialog,
  handleDoneStatusChange,
  handleContentStatusChange,
  formatDisplayDate,
}) => {
  return (
    <>
      <TableCell className="p-2">
        {item.productionApproved && item.googleDriveLink ? (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => window.open(item.googleDriveLink, "_blank")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        ) : null}
      </TableCell>
      <TableCell className="p-2">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={() => openLinkDialog(item.id, "postLink", item.postLink)}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {item.postLink ? 
            (item.postLink.length > 25 ? 
              `${item.postLink.substring(0, 25)}...` : 
              item.postLink) : 
            'Add post link'}
        </Button>
      </TableCell>
      <TableCell className="p-2 text-center">
        <Checkbox 
          checked={item.isDone}
          onCheckedChange={(checked) => {
            handleDoneStatusChange(item.id, Boolean(checked));
          }}
        />
      </TableCell>
      <TableCell className="p-2">
        {item.actualPostDate ? (
          <div className="text-center">
            {formatDisplayDate(item.actualPostDate)}
          </div>
        ) : null}
      </TableCell>
      <TableCell className="p-2">
        <div className={`text-center ${item.onTimeStatus?.startsWith('Late') ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}`}>
          {item.onTimeStatus || "-"}
        </div>
      </TableCell>
      <TableCell className="p-2">
        <Select 
          value={item.contentStatus} 
          onValueChange={(value) => handleContentStatusChange(item.id, value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            <SelectItem value="recommended">Recommended For Ads</SelectItem>
            <SelectItem value="cancel">Cancel</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </>
  );
};

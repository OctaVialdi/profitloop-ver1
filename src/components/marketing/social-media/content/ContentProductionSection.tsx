
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ContentItem } from "@/types/contentManagement";

interface ContentProductionSectionProps {
  item: ContentItem;
  productionTeam: any[];
  isCalendarOpen: { [key: string]: boolean };
  toggleCalendar: (itemId: string, type: string) => void;
  handleDateChange: (itemId: string, date: Date | undefined, type: string) => void;
  handlePICProductionChange: (itemId: string, picName: string) => void;
  openLinkDialog: (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => void;
  handleProductionStatusChange: (itemId: string, status: string) => void;
  resetProductionRevisionCounter: (itemId: string) => void;
  toggleApproval: (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => void;
  formatDisplayDate: (dateString: string | undefined) => string;
}

export const ContentProductionSection: React.FC<ContentProductionSectionProps> = ({
  item,
  productionTeam,
  isCalendarOpen,
  toggleCalendar,
  handleDateChange,
  handlePICProductionChange,
  openLinkDialog,
  handleProductionStatusChange,
  resetProductionRevisionCounter,
  toggleApproval,
  formatDisplayDate,
}) => {
  return (
    <>
      <TableCell className="p-2">
        {item.contentType ? item.contentType : "-"}
      </TableCell>
      <TableCell className="p-2">
        {item.title ? 
          (item.title.length > 25 ? 
            `${item.title.substring(0, 25)}...` : 
            item.title) : 
          '-'}
      </TableCell>
      <TableCell className="p-2">
        <Select 
          value={item.picProduction} 
          onValueChange={(value) => handlePICProductionChange(item.id, value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select Production PIC" />
          </SelectTrigger>
          <SelectContent>
            {productionTeam.length > 0 ? (
              productionTeam.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-pic-found" disabled>
                No production team found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={() => openLinkDialog(item.id, "googleDrive", item.googleDriveLink)}
        >
          <Link className="mr-2 h-4 w-4" />
          {item.googleDriveLink ? 
            (item.googleDriveLink.length > 25 ? 
              `${item.googleDriveLink.substring(0, 25)}...` : 
              item.googleDriveLink) : 
            'Add Google Drive link'}
        </Button>
      </TableCell>
      <TableCell className="p-2">
        <Select 
          value={item.productionStatus} 
          onValueChange={(value) => handleProductionStatusChange(item.id, value)}
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
          <span>{item.productionRevisionCount || 0}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => resetProductionRevisionCounter(item.id)}
            className="h-6 w-6"
          >
            <RefreshCcw className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="p-2">
        {item.productionStatus === "review" && item.productionCompletionDate ? (
          <div className="text-center">
            {formatDisplayDate(item.productionCompletionDate)}
          </div>
        ) : null}
      </TableCell>
      <TableCell className="p-2 text-center">
        <Checkbox 
          checked={item.productionApproved}
          onCheckedChange={(checked) => {
            toggleApproval(item.id, Boolean(checked), "productionApproved");
          }}
        />
      </TableCell>
      <TableCell className="p-2">
        {item.productionApproved && item.productionApprovedDate ? (
          <div className="text-center">
            {formatDisplayDate(item.productionApprovedDate)}
          </div>
        ) : null}
      </TableCell>
    </>
  );
};

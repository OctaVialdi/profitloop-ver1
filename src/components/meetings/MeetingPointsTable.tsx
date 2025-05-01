import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { History, Edit, Trash2 } from "lucide-react";
import { MeetingPointPopover } from "@/components/meetings/MeetingPointPopover";
import { MeetingStatusBadge } from "@/components/meetings/MeetingStatusBadge";
import { MeetingActionButton } from "@/components/meetings/MeetingActionButton";
import { MeetingPoint, MeetingStatus } from "@/types/meetings";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

interface MeetingPointsTableProps {
  meetingPoints: MeetingPoint[];
  loading: boolean;
  updateCounts: Record<string, number>;
  onStatusChange: (meetingId: string, status: MeetingStatus) => void;
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onEdit: (meeting: MeetingPoint) => void;
  onDelete: (meeting: MeetingPoint) => void;
  onViewUpdates: (meeting: MeetingPoint) => void;
  onAddPoint: (point: string) => Promise<boolean>;
  requestByOptions: string[];
}

export const MeetingPointsTable: React.FC<MeetingPointsTableProps> = ({
  meetingPoints,
  loading,
  updateCounts,
  onStatusChange,
  onRequestByChange,
  onEdit,
  onDelete,
  onViewUpdates,
  onAddPoint,
  requestByOptions
}) => {
  const [newPoint, setNewPoint] = useState<string>("");
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  
  const handleAddPoint = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPoint.trim() !== "") {
      try {
        setInputLoading(true);
        // Prevent default to avoid form submission if this is inside a form
        e.preventDefault();
        
        // Call the onAddPoint function passed from parent component
        const success = await onAddPoint(newPoint);
        
        if (success) {
          // Only clear input if save was successful
          setNewPoint("");
          toast.success("Meeting point added successfully");
        }
      } catch (error) {
        console.error("Error adding meeting point:", error);
        toast.error("Failed to add meeting point. Please try again.");
      } finally {
        setInputLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b">
              <TableHead className="w-[120px] py-4 whitespace-nowrap">DATE</TableHead>
              <TableHead className="py-4 w-[300px]">DISCUSSION POINT</TableHead>
              <TableHead className="w-[140px] py-4 whitespace-nowrap">REQUEST BY</TableHead>
              <TableHead className="w-[140px] py-4 whitespace-nowrap">STATUS</TableHead>
              <TableHead className="w-[100px] py-4 whitespace-nowrap">UPDATES</TableHead>
              <TableHead className="w-[140px] py-4 whitespace-nowrap">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading meeting points...</TableCell>
              </TableRow>
            ) : meetingPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No meeting points found. Add one below.
                </TableCell>
              </TableRow>
            ) : (
              meetingPoints.map((point, index) => (
                <TableRow key={point.id} className={index % 2 === 0 ? "" : "bg-[#f9fafb]"}>
                  <TableCell className="py-4 whitespace-nowrap h-16">{point.date}</TableCell>
                  <TableCell className="py-4 w-[300px] h-16">
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                      <MeetingPointPopover text={point.discussion_point} maxLength={50}>
                        <div className="truncate cursor-pointer hover:text-blue-600" style={{ 
                          maxWidth: '280px', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {point.discussion_point}
                        </div>
                      </MeetingPointPopover>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap h-16">
                    <Select 
                      defaultValue={point.request_by || "unassigned"} 
                      onValueChange={(value) => onRequestByChange(point.id, value)}
                    >
                      <SelectTrigger className="w-[120px] bg-[#f5f5fa]">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Select person</SelectItem>
                        {requestByOptions.filter(Boolean).map((person) => (
                          <SelectItem key={person} value={person}>
                            {person}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap h-16">
                    <MeetingStatusBadge 
                      status={point.status} 
                      onChange={(value) => onStatusChange(point.id, value as MeetingStatus)} 
                    />
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap h-16">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewUpdates(point)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View and Add Updates"
                      >
                        <History size={16} />
                        <span className="ml-2">
                          {updateCounts[point.id] || 0}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 whitespace-nowrap h-16">
                    <div className="flex space-x-2">
                      <MeetingActionButton 
                        icon={Edit} 
                        label="Edit" 
                        onClick={() => onEdit(point)} 
                      />
                      <MeetingActionButton 
                        icon={Trash2} 
                        label="Delete" 
                        variant="destructive" 
                        onClick={() => onDelete(point)} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell className="py-4 whitespace-nowrap h-16">{""}</TableCell>
              <TableCell colSpan={5} className="py-4 h-16">
                <input
                  type="text"
                  placeholder="Type a new discussion point and press Enter..."
                  className="w-full py-2 focus:outline-none text-gray-500 italic"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  onKeyDown={handleAddPoint}
                  disabled={inputLoading}
                />
                {inputLoading && <span className="text-xs text-gray-400 ml-2">Saving...</span>}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

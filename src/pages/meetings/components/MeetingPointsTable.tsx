
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeetingStatusBadge } from "@/components/meetings/MeetingStatusBadge";
import { MeetingActionButton } from "@/components/meetings/MeetingActionButton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MeetingPoint, MeetingStatus } from "@/types/meetings";
import { Filter } from "lucide-react";

interface MeetingPointsTableProps {
  loading: boolean;
  filteredMeetingPoints: MeetingPoint[];
  searchTerm: string;
  updateCounts: Record<string, number>;
  onStatusChange: (meetingId: string, newStatus: MeetingStatus) => void;
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onEdit: (meeting: MeetingPoint) => void;
  onDelete: (meeting: MeetingPoint) => void;
  onAddUpdates: (meeting: MeetingPoint) => void;
  uniqueRequestBy: string[];
}

export function MeetingPointsTable({
  loading,
  filteredMeetingPoints,
  searchTerm,
  updateCounts,
  onStatusChange,
  onRequestByChange,
  onEdit,
  onDelete,
  onAddUpdates,
  uniqueRequestBy
}: MeetingPointsTableProps) {
  return (
    <Card className="shadow-md border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Meeting Points
          </CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMeetingPoints.length} {filteredMeetingPoints.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[120px] text-left font-semibold px-[19px]">DATE</TableHead>
                <TableHead className="w-[300px] text-left font-semibold px-[86px]">DISCUSSION POINT</TableHead>
                <TableHead className="w-[140px] text-center font-semibold mx-0 px-0">REQUEST BY</TableHead>
                <TableHead className="w-[140px] text-center font-semibold px-0">STATUS</TableHead>
                <TableHead className="w-[100px] text-center font-semibold mx-0 my-0 px-0">UPDATES</TableHead>
                <TableHead className="w-[140px] text-right font-semibold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          
          <div className="overflow-hidden" style={{ height: "600px" }}>
            <ScrollArea className="h-full">
              <Table>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <div className="mt-2 text-gray-500">Loading meeting points...</div>
                      </TableCell>
                    </TableRow>
                  ) : filteredMeetingPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No matching meeting points found.' : 'No meeting points found. Add one above.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {filteredMeetingPoints.map((point, index) => (
                        <motion.tr
                          key={point.id}
                          className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell className="w-[120px] text-left font-medium text-gray-700 dark:text-gray-300">
                            {point.date}
                          </TableCell>
                          <TableCell className="w-[300px] text-left px-[25px]">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative h-10 overflow-hidden">
                                    <ScrollArea className="h-10 w-full">
                                      <div className="pr-3 text-left">{point.discussion_point}</div>
                                    </ScrollArea>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md p-2 bg-white dark:bg-gray-800 shadow-lg">
                                  <p className="text-sm">{point.discussion_point}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="w-[140px] text-center px-0">
                            <Select 
                              defaultValue={point.request_by || "unassigned"} 
                              onValueChange={value => onRequestByChange(point.id, value)}
                            >
                              <SelectTrigger className="w-[120px] mx-auto bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                <SelectValue placeholder="Select person" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Select person</SelectItem>
                                {uniqueRequestBy.map(person => (
                                  <SelectItem key={person} value={person}>
                                    {person}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="w-[140px] text-center px-0">
                            <MeetingStatusBadge 
                              status={point.status} 
                              onChange={value => onStatusChange(point.id, value as MeetingStatus)} 
                            />
                          </TableCell>
                          <TableCell className="w-[100px] text-center">
                            <div className="flex justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onAddUpdates(point)} 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900" 
                                title="View and Add Updates"
                              >
                                <History size={16} />
                                <span className="ml-2 font-medium">
                                  {updateCounts[point.id] || 0}
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="w-[140px] text-right">
                            <div className="flex justify-end space-x-2">
                              <MeetingActionButton 
                                icon={Edit} 
                                label="Edit" 
                                onClick={() => onEdit(point)} 
                                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" 
                              />
                              <MeetingActionButton 
                                icon={Trash2} 
                                label="Delete" 
                                variant="destructive" 
                                onClick={() => onDelete(point)} 
                                className="hover:bg-red-100 dark:hover:bg-red-900" 
                              />
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContentPlan, ContentPlanItem } from "@/hooks/useContentPlan";
import { useEmployeesByPosition } from "@/hooks/useEmployeesByPosition";
import { format } from "date-fns";

export const ContentPlan: React.FC = () => {
  const { contentItems, isLoading: isLoadingContent } = useContentPlan();
  const { employees: contentPlanners, isLoading: isLoadingContentPlanners } = useEmployeesByPosition("Content Planner");
  const { employees: creatives, isLoading: isLoadingCreatives } = useEmployeesByPosition("Creative");
  
  const [selectedContentPlanner, setSelectedContentPlanner] = useState<string>("");
  const [selectedCreative, setSelectedCreative] = useState<string>("");

  return (
    <ScrollArea className="h-[500px]">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="pic" className="block text-sm font-medium mb-1">PIC (Content Planner)</label>
            <Select value={selectedContentPlanner} onValueChange={setSelectedContentPlanner}>
              <SelectTrigger id="pic" className="w-full">
                <SelectValue placeholder="Select content planner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Content Planners</SelectItem>
                {!isLoadingContentPlanners && contentPlanners.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="pic-production" className="block text-sm font-medium mb-1">PIC Production (Creative)</label>
            <Select value={selectedCreative} onValueChange={setSelectedCreative}>
              <SelectTrigger id="pic-production" className="w-full">
                <SelectValue placeholder="Select creative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Creatives</SelectItem>
                {!isLoadingCreatives && creatives.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      
        {isLoadingContent ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>PIC Production</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No content plan items found</TableCell>
                </TableRow>
              ) : (
                contentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.post_date ? format(new Date(item.post_date), 'dd MMM yyyy') : 'Not set'}
                    </TableCell>
                    <TableCell>{item.title || 'Untitled'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status || 'New'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress || 0} className="h-2" />
                        <span className="text-xs">{item.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={item.pic_id || ""}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select PIC" />
                        </SelectTrigger>
                        <SelectContent>
                          {!isLoadingContentPlanners && contentPlanners.map((planner) => (
                            <SelectItem key={planner.id} value={planner.id}>
                              {planner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={item.pic_production_id || ""}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select Production" />
                        </SelectTrigger>
                        <SelectContent>
                          {!isLoadingCreatives && creatives.map((creative) => (
                            <SelectItem key={creative.id} value={creative.id}>
                              {creative.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <button className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </ScrollArea>
  );
};


import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ContentManager } from "../../types/socialMedia";

interface ContentManagersTableProps {
  contentManagers: ContentManager[];
  handleEditTarget: (manager: ContentManager) => void;
}

const ContentManagersTable: React.FC<ContentManagersTableProps> = ({
  contentManagers,
  handleEditTarget,
}) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-8 w-[150px] py-1 text-center">PIC</TableHead>
          <TableHead className="h-8 text-center w-[150px] py-1">Daily Target</TableHead>
          <TableHead className="h-8 text-center w-[150px] py-1">Monthly Target</TableHead>
          <TableHead className="h-8 text-center w-[150px] py-1">
            Target Adjusted
          </TableHead>
          <TableHead className="h-8 w-[200px] py-1 text-center">Progress</TableHead>
          <TableHead className="h-8 text-center py-1">On Time Rate</TableHead>
          <TableHead className="h-8 text-center py-1">Effective Rate</TableHead>
          <TableHead className="h-8 text-center py-1">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contentManagers.map((manager) => (
          <TableRow key={manager.name} className="hover:bg-gray-50/80">
            <TableCell className="py-1 px-4 font-medium text-sm text-center">{manager.name}</TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">{manager.dailyTarget}</TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">{manager.monthlyTarget}</TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">
              <div className="flex items-center justify-center gap-1">
                <span>{manager.monthlyTargetAdjusted}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4"
                  onClick={() => handleEditTarget(manager)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell className="py-1 px-4">
              <div className="flex items-center gap-2">
                <Progress value={manager.progress} className="h-1.5" />
                <span className="text-xs">{manager.progress}%</span>
              </div>
            </TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">{manager.onTimeRate}%</TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">{manager.effectiveRate}%</TableCell>
            <TableCell className="py-1 px-4 text-center text-sm">{manager.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContentManagersTable;

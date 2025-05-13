
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ContentPlanCardProps {
  title: string;
  children: React.ReactNode;
  onAddRow: () => void;
  onDeleteSelected: () => void;
  hasSelectedItems: boolean;
}

export const ContentPlanCard: React.FC<ContentPlanCardProps> = ({
  title,
  children,
  onAddRow,
  onDeleteSelected,
  hasSelectedItems
}) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="py-3 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex space-x-2">
          {hasSelectedItems && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDeleteSelected}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          )}
          <Button 
            onClick={onAddRow} 
            size="sm" 
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
};


import React from "react";
import { CardFooter } from "@/components/ui/card";

interface ContentFooterProps {
  totalItems: number;
  selectedItemsCount: number;
}

export const ContentFooter: React.FC<ContentFooterProps> = ({
  totalItems,
  selectedItemsCount
}) => {
  return (
    <CardFooter className="pt-2 flex justify-between">
      <div className="text-sm text-muted-foreground">
        {totalItems} item{totalItems !== 1 ? 's' : ''} 
        {selectedItemsCount > 0 && ` (${selectedItemsCount} selected)`}
      </div>
    </CardFooter>
  );
};

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface InputRowProps {
  currentDate: string;
  newPoint: string;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InputRow: React.FC<InputRowProps> = ({ 
  currentDate, 
  newPoint, 
  onNewPointChange, 
  onNewPointKeyDown 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Only submit on Enter if not pressing Shift (to allow multi-line input)
    if (e.key === 'Enter' && !e.shiftKey) {
      onNewPointKeyDown(e);
      // Keep expanded after submitting to allow quick entry of multiple points
      // Reset the text field but keep the expanded state
      if (newPoint.trim() === '') {
        setIsExpanded(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 border-t bg-white">
      {isExpanded && (
        <div className="col-span-2 pr-2 text-muted-foreground text-sm">
          {currentDate}
        </div>
      )}
      <div className={isExpanded ? "col-span-10" : "col-span-12"}>
        {isExpanded ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Type a new discussion point and press Enter to submit..."
              className="w-full min-h-[80px] py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              value={newPoint}
              onChange={(e) => onNewPointChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={(e) => {
                  onNewPointKeyDown({ key: 'Enter', shiftKey: false } as any);
                  if (newPoint.trim() === '') {
                    setIsExpanded(false);
                  }
                }}
              >
                Add Point
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Plus size={16} />
            <span className="text-muted-foreground">Click to add a new discussion point...</span>
          </div>
        )}
      </div>
    </div>
  );
};

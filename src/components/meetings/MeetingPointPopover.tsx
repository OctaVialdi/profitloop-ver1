
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MeetingPointPopoverProps {
  text: string;
  maxLength?: number;
  children: React.ReactNode;
  showTooltip?: boolean;
}

export const MeetingPointPopover: React.FC<MeetingPointPopoverProps> = ({ 
  text, 
  maxLength = 100,
  children,
  showTooltip = true
}) => {
  const isTextTooLong = text.length > maxLength;
  const truncatedText = isTextTooLong
    ? `${text.substring(0, maxLength)}...`
    : text;
  
  if (!isTextTooLong) {
    return showTooltip ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            {text}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <>{children}</>
    );
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700 break-words">
            {text}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

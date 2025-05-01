
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MeetingPointPopoverProps {
  text: string;
  maxLength?: number;
  children: React.ReactNode;
}

export const MeetingPointPopover: React.FC<MeetingPointPopoverProps> = ({ 
  text, 
  maxLength = 100,
  children 
}) => {
  const isTextTooLong = text.length > maxLength;
  const truncatedText = isTextTooLong
    ? `${text.substring(0, maxLength)}...`
    : text;
  
  if (!isTextTooLong) {
    return <>{children}</>;
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

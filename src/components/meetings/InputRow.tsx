
import React from 'react';
import { Input } from "@/components/ui/input";

interface InputRowProps {
  currentDate: string;
  newPoint: string;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputRow: React.FC<InputRowProps> = ({ 
  currentDate, 
  newPoint, 
  onNewPointChange, 
  onNewPointKeyDown 
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-2 px-4 border-t bg-white">
      <div className="col-span-2">{currentDate}</div>
      <div className="col-span-10">
        <Input
          type="text"
          placeholder="Type a new discussion point and press Enter..."
          className="w-full py-2 focus:outline-none text-gray-500 italic"
          value={newPoint}
          onChange={(e) => onNewPointChange(e.target.value)}
          onKeyDown={onNewPointKeyDown}
        />
      </div>
    </div>
  );
};

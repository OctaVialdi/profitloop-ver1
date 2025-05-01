
import React from 'react';
import { Input } from "@/components/ui/input";

interface EmptyMeetingTableProps {
  currentDate: string;
  newPoint: string;
  onNewPointChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const EmptyMeetingTable: React.FC<EmptyMeetingTableProps> = ({
  currentDate,
  newPoint,
  onNewPointChange,
  onNewPointKeyDown
}) => {
  return (
    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
      <p>No meeting points found. Add one below.</p>
      <div className="mt-4 px-4 flex items-center">
        <div className="w-1/6">{currentDate}</div>
        <div className="w-5/6">
          <Input
            type="text"
            placeholder="Type a new discussion point and press Enter..."
            className="w-full py-2 focus:outline-none text-gray-500 italic"
            value={newPoint}
            onChange={onNewPointChange}
            onKeyDown={onNewPointKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

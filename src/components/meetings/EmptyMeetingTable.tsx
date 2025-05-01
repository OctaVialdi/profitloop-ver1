
import React from 'react';
import { InputRow } from './InputRow';

interface EmptyMeetingTableProps {
  currentDate: string;
  newPoint: string;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EmptyMeetingTable: React.FC<EmptyMeetingTableProps> = ({ 
  currentDate, 
  newPoint, 
  onNewPointChange, 
  onNewPointKeyDown
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium text-sm text-muted-foreground border-b">
        <div className="col-span-2 pr-2">DATE</div>
        <div className="col-span-3">DISCUSSION POINT</div>
        <div className="col-span-2">REQUEST BY</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-1">UPDATES</div>
        <div className="col-span-2">ACTIONS</div>
      </div>
      <div className="py-10 text-center text-muted-foreground">
        <p className="mb-4">No meeting points yet. Add your first one below!</p>
      </div>
      <InputRow
        currentDate={currentDate}
        newPoint={newPoint}
        onNewPointChange={onNewPointChange}
        onNewPointKeyDown={onNewPointKeyDown}
      />
    </div>
  );
};

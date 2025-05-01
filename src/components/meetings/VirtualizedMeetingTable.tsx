
import { FixedSizeList as List } from 'react-window';
import { useState, useEffect } from 'react';
import { MeetingStatus, MeetingPoint } from "@/types/meetings";
import Spinner from "../Spinner";
import { TableHeader } from "./TableHeader";
import { InputRow } from "./InputRow";
import { MeetingRow } from "./MeetingRow";
import { EmptyMeetingTable } from "./EmptyMeetingTable";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

interface VirtualizedMeetingTableProps {
  meetingPoints: MeetingPoint[];
  loading: boolean;
  updateCounts: Record<string, number>;
  onStatusChange: (meetingId: string, status: MeetingStatus) => void;
  onRequestByChange: (meetingId: string, requestBy: string) => void;
  onEditMeeting: (meeting: MeetingPoint) => void;
  onDeletePrompt: (meeting: MeetingPoint) => void;
  onAddUpdates: (meeting: MeetingPoint) => void;
  onNewPointChange: (value: string) => void;
  onNewPointKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  newPoint: string;
  requestByOptions: string[];
}

export const VirtualizedMeetingTable = ({
  meetingPoints,
  loading,
  updateCounts,
  onStatusChange,
  onRequestByChange,
  onEditMeeting,
  onDeletePrompt,
  onAddUpdates,
  onNewPointChange,
  onNewPointKeyDown,
  newPoint,
  requestByOptions
}: VirtualizedMeetingTableProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const ROW_HEIGHT = 72; // Approximate height of each row in pixels
  const HEADER_HEIGHT = 56; // Height of the table header
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  // Calculate list height
  const listHeight = Math.min(
    windowHeight * 0.6, // 60% of window height
    meetingPoints.length * ROW_HEIGHT + ROW_HEIGHT + 50 // Total height of all rows + input row + some buffer
  );

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    if (index === meetingPoints.length) {
      // This is the input row
      return (
        <div style={style}>
          <InputRow
            currentDate={currentDate}
            newPoint={newPoint}
            onNewPointChange={onNewPointChange}
            onNewPointKeyDown={onNewPointKeyDown}
          />
        </div>
      );
    }

    const point = meetingPoints[index];
    return (
      <div style={style}>
        <MeetingRow
          point={point}
          requestByOptions={requestByOptions}
          onRequestByChange={onRequestByChange}
          onStatusChange={onStatusChange}
          onAddUpdates={onAddUpdates}
          onEditMeeting={onEditMeeting}
          onDeletePrompt={onDeletePrompt}
          updateCount={updateCounts[point.id] || 0}
          isEven={index % 2 === 0}
        />
      </div>
    );
  };

  if (loading) {
    return <Spinner centered size="lg" />;
  }

  if (meetingPoints.length === 0) {
    return (
      <EmptyMeetingTable
        currentDate={currentDate}
        newPoint={newPoint}
        onNewPointChange={(e) => onNewPointChange(e.target.value)}
        onNewPointKeyDown={onNewPointKeyDown}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <TableHeader />
      <List
        height={listHeight}
        itemCount={meetingPoints.length + 1} // +1 for the input row
        itemSize={ROW_HEIGHT}
        width="100%"
        className="custom-scrollbar"
      >
        {Row}
      </List>
    </div>
  );
};

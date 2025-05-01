
import React from "react";
import { MeetingUpdate } from "@/types/meetings";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";

interface RecentUpdatesSectionProps {
  recentUpdates: MeetingUpdate[];
}

export const RecentUpdatesSection: React.FC<RecentUpdatesSectionProps> = ({
  recentUpdates
}) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Recent Updates</h3>
      <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
        {recentUpdates.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent updates.</p>
        ) : (
          recentUpdates.map((update) => (
            <MeetingUpdateItem
              key={update.id}
              title={update.title}
              status={update.status}
              person={update.person}
              date={update.date}
            />
          ))
        )}
      </div>
    </>
  );
};

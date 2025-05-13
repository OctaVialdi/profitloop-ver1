
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Plus } from "lucide-react";

interface MeetingHeaderProps {
  currentDate: string;
  onGenerateMinutes: () => void;
  onCreateMeeting: () => void;
}

export function MeetingHeader({ 
  currentDate, 
  onGenerateMinutes, 
  onCreateMeeting 
}: MeetingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b shadow-sm">
      <div className="max-w-full mx-auto p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{currentDate}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900 transition-all"
            onClick={onGenerateMinutes}
          >
            <Download size={16} />
            <span>Download Minutes</span>
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 transition-all" 
            onClick={onCreateMeeting}
          >
            <Plus size={16} className="mr-2" />
            <span>New Meeting Point</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

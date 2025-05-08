
import React from "react";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation } from "lucide-react";
import { MeetingStatus } from "@/types/meetings";

interface MeetingUpdateItemProps {
  title: string;
  status: MeetingStatus;
  person: string;
  date: string;
}

export const MeetingUpdateItem: React.FC<MeetingUpdateItemProps> = ({ 
  title, 
  status, 
  person,
  date 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "not-started":
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
      case "on-going":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
      case "presented":
        return <Presentation className="w-4 h-4 text-purple-600 dark:text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "not-started":
        return "Not Started";
      case "on-going":
        return "On Going";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      case "presented":
        return "Presented";
      default:
        return "Not Started";
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "not-started":
        return "text-amber-700 dark:text-amber-500";
      case "on-going":
        return "text-blue-700 dark:text-blue-500";
      case "completed":
        return "text-green-700 dark:text-green-500";
      case "rejected":
        return "text-red-700 dark:text-red-500";
      case "presented":
        return "text-purple-700 dark:text-purple-500";
      default:
        return "text-amber-700 dark:text-amber-500";
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md p-2 -mx-2">
      {/* Wrap the title text to prevent overflow */}
      <div className="font-medium mb-1 break-words whitespace-normal text-gray-800 dark:text-gray-100">{title}</div>
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center gap-1 min-w-0">
          {getStatusIcon()}
          <span className={`${getStatusColor()} truncate font-medium`}>{getStatusLabel()}</span>
        </div>
        {/* Prevent person name from getting too long */}
        <div className="text-gray-500 dark:text-gray-400 truncate max-w-[100px] text-xs">{person}</div>
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{date}</div>
    </div>
  );
};


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
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "on-going":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "presented":
        return <Presentation className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
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
        return "text-gray-600";
      case "on-going":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "presented":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="border-b pb-4">
      <div className="font-medium mb-1">{title}</div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className={`${getStatusColor()}`}>{getStatusLabel()}</span>
        </div>
        <div className="text-gray-500">{person}</div>
      </div>
      <div className="text-right text-sm text-gray-500">{date}</div>
    </div>
  );
};


import React from "react";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeetingStatus } from "@/types/meetings";

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
  onChange?: (value: string) => void;
}

export const MeetingStatusBadge: React.FC<MeetingStatusBadgeProps> = ({ status, onChange }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "not-started":
        return {
          icon: AlertTriangle,
          label: "Not Started",
          color: "text-amber-700 dark:text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        };
      case "on-going":
        return {
          icon: Clock,
          label: "On Going",
          color: "text-blue-700 dark:text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        };
      case "completed":
        return {
          icon: CheckCircle,
          label: "Completed",
          color: "text-green-700 dark:text-green-500",
          bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        };
      case "rejected":
        return {
          icon: XCircle,
          label: "Rejected",
          color: "text-red-700 dark:text-red-500",
          bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        };
      case "presented":
        return {
          icon: Presentation,
          label: "Presented",
          color: "text-purple-700 dark:text-purple-500",
          bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
        };
      default:
        return {
          icon: AlertTriangle,
          label: "Not Started",
          color: "text-amber-700 dark:text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Select defaultValue={status} onValueChange={onChange}>
      <SelectTrigger className={`w-[150px] border ${statusConfig.bg} ${statusConfig.color} mx-auto transition-colors rounded-full`}>
        <div className="flex items-center">
          <StatusIcon className="w-4 h-4 mr-2" />
          <SelectValue>{statusConfig.label}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
        <SelectItem value="not-started" className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-500" />
            Not Started
          </div>
        </SelectItem>
        <SelectItem value="on-going" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />
            On Going
          </div>
        </SelectItem>
        <SelectItem value="completed" className="hover:bg-green-50 dark:hover:bg-green-900/20">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
            Completed
          </div>
        </SelectItem>
        <SelectItem value="rejected" className="hover:bg-red-50 dark:hover:bg-red-900/20">
          <div className="flex items-center">
            <XCircle className="w-4 h-4 mr-2 text-red-600 dark:text-red-500" />
            Rejected
          </div>
        </SelectItem>
        <SelectItem value="presented" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
          <div className="flex items-center">
            <Presentation className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" />
            Presented
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

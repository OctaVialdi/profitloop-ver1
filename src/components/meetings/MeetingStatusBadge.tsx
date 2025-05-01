
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
          color: "text-gray-600",
          bg: "bg-[#f5f5fa]"
        };
      case "on-going":
        return {
          icon: Clock,
          label: "On Going",
          color: "text-blue-600",
          bg: "bg-[#f5f5fa]"
        };
      case "completed":
        return {
          icon: CheckCircle,
          label: "Completed",
          color: "text-green-600",
          bg: "bg-[#f5f5fa]"
        };
      case "rejected":
        return {
          icon: XCircle,
          label: "Rejected",
          color: "text-red-600",
          bg: "bg-[#f5f5fa]"
        };
      case "presented":
        return {
          icon: Presentation,
          label: "Presented",
          color: "text-purple-600",
          bg: "bg-[#f5f5fa]"
        };
      default:
        return {
          icon: AlertTriangle,
          label: "Not Started",
          color: "text-gray-600",
          bg: "bg-[#f5f5fa]"
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Select defaultValue={status} onValueChange={onChange}>
      <SelectTrigger className={`w-[150px] ${statusConfig.bg} ${statusConfig.color} mx-auto`}>
        <div className="flex items-center">
          <StatusIcon className="w-5 h-5 mr-2" />
          <SelectValue>{statusConfig.label}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="not-started">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />
            Not Started
          </div>
        </SelectItem>
        <SelectItem value="on-going">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            On Going
          </div>
        </SelectItem>
        <SelectItem value="completed">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Completed
          </div>
        </SelectItem>
        <SelectItem value="rejected">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-600" />
            Rejected
          </div>
        </SelectItem>
        <SelectItem value="presented">
          <div className="flex items-center">
            <Presentation className="w-5 h-5 mr-2 text-purple-600" />
            Presented
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

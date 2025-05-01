
import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export type MeetingStatus = "not-started" | "on-going" | "completed" | "rejected" | "presented" | "updates";

interface MeetingSummaryCardProps {
  status: MeetingStatus;
  count: number;
  icon: LucideIcon;
  label: string;
}

export const MeetingSummaryCard: React.FC<MeetingSummaryCardProps> = ({ status, count, icon: Icon, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "not-started":
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "text-gray-600",
          countBg: "bg-gray-100"
        };
      case "on-going":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: "text-blue-500",
          countBg: "bg-blue-50"
        };
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          icon: "text-green-500",
          countBg: "bg-green-50"
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: "text-red-500",
          countBg: "bg-red-50"
        };
      case "presented":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          icon: "text-purple-500",
          countBg: "bg-purple-50"
        };
      case "updates":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: "text-amber-500",
          countBg: "bg-amber-50"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "text-gray-600",
          countBg: "bg-gray-100"
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <Card className={`relative flex flex-col items-center p-4 ${styles.bg} border-0`}>
      <div className={`rounded-full p-2 ${styles.icon} absolute top-2 right-2`}>
        <Icon size={16} />
      </div>
      <span className={`text-3xl font-bold ${styles.text}`}>{count}</span>
      <span className={`text-sm font-medium ${styles.text}`}>{label}</span>
    </Card>
  );
};

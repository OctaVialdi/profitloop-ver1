
import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { MeetingSummaryStatus } from "@/types/meetings";

interface MeetingSummaryCardProps {
  status: MeetingSummaryStatus;
  count: number;
  icon: LucideIcon;
  label: string;
}

export const MeetingSummaryCard: React.FC<MeetingSummaryCardProps> = ({ status, count, icon: Icon, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "not-started":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          text: "text-amber-700 dark:text-amber-500",
          icon: "text-amber-600 dark:text-amber-500",
          border: "border-amber-200 dark:border-amber-800",
        };
      case "on-going":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          text: "text-blue-700 dark:text-blue-500",
          icon: "text-blue-600 dark:text-blue-500",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "completed":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          text: "text-green-700 dark:text-green-500",
          icon: "text-green-600 dark:text-green-500",
          border: "border-green-200 dark:border-green-800",
        };
      case "rejected":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          text: "text-red-700 dark:text-red-500",
          icon: "text-red-600 dark:text-red-500",
          border: "border-red-200 dark:border-red-800",
        };
      case "presented":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          text: "text-purple-700 dark:text-purple-500",
          icon: "text-purple-600 dark:text-purple-500",
          border: "border-purple-200 dark:border-purple-800",
        };
      case "updates":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          text: "text-indigo-700 dark:text-indigo-500",
          icon: "text-indigo-600 dark:text-indigo-500",
          border: "border-indigo-200 dark:border-indigo-800",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          text: "text-gray-700 dark:text-gray-300",
          icon: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <Card className={`relative flex flex-col items-center p-4 ${styles.bg} ${styles.border} border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden`}>
      <div className={`rounded-full p-2 ${styles.icon} absolute top-2 right-2`}>
        <Icon size={16} />
      </div>
      <span className={`text-3xl font-bold ${styles.text}`}>{count}</span>
      <span className={`text-sm font-medium ${styles.text} mt-1`}>{label}</span>
    </Card>
  );
};

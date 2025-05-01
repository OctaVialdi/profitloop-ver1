
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface MeetingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

export const MeetingActionButton: React.FC<MeetingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "outline"
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      className="h-8 px-2"
      onClick={onClick}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

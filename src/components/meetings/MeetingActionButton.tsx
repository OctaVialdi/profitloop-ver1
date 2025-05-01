
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface MeetingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
  showLabel?: boolean;
}

export const MeetingActionButton: React.FC<MeetingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
  showLabel = false
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      className={`h-8 ${showLabel ? 'px-3' : 'px-2'}`}
      onClick={onClick}
      title={label}
    >
      <Icon className="h-4 w-4" />
      {showLabel && <span className="ml-2">{label}</span>}
    </Button>
  );
};

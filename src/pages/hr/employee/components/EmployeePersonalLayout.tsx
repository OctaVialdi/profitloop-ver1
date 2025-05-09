
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmployeePersonalLayoutProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const EmployeePersonalLayout: React.FC<EmployeePersonalLayoutProps> = ({
  id,
  title,
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate(`/hr/data/employee/${id}`)}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee Details</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">{title}</h1>
      
      {children}
    </div>
  );
};

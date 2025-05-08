
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const EmployeeHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Employee list</h2>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link to="/hr/data/add-employee">Add employee</Link>
        </Button>
      </div>
    </div>
  );
};

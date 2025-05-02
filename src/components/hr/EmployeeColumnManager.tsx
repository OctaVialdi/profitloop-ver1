
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ColumnManagerProps {
  columns: Record<string, boolean>;
  onColumnChange: (columns: Record<string, boolean>) => void;
}

export const EmployeeColumnManager: React.FC<ColumnManagerProps> = ({ columns, onColumnChange }) => {
  const handleToggleColumn = (name: string) => {
    onColumnChange({
      ...columns,
      [name]: !columns[name],
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(columns).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    onColumnChange(allSelected);
  };

  // Convert columns into a more organized structure for rendering
  const columnGroups = [
    {
      title: "Basic Information",
      columns: [
        { key: "name", label: "Employee name" },
        { key: "email", label: "Email" },
        { key: "branch", label: "Branch" },
        { key: "organization", label: "Organization" },
      ]
    },
    {
      title: "Job Information",
      columns: [
        { key: "jobPosition", label: "Job position" },
        { key: "jobLevel", label: "Job level" },
        { key: "employmentStatus", label: "Employment status" },
      ]
    },
    {
      title: "Dates",
      columns: [
        { key: "joinDate", label: "Join date" },
        { key: "endDate", label: "End date" },
        { key: "signDate", label: "Sign date" },
        { key: "resignDate", label: "Resign date" },
      ]
    },
    {
      title: "Personal Information",
      columns: [
        { key: "barcode", label: "Barcode" },
        { key: "birthDate", label: "Birth date" },
        { key: "birthPlace", label: "Birth place" },
        { key: "address", label: "Address" },
        { key: "mobilePhone", label: "Mobile phone" },
        { key: "religion", label: "Religion" },
        { key: "gender", label: "Gender" },
        { key: "maritalStatus", label: "Marital status" },
      ]
    }
  ];

  return (
    <div className="h-full max-h-[500px] overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">MANAGE COLUMN</h3>
          <Button variant="ghost" className="text-blue-600" onClick={handleSelectAll}>
            Select all
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {columnGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">{group.title}</h4>
            {group.columns.map((col) => (
              <div key={col.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`col-${col.key}`}
                  checked={columns[col.key] || false}
                  onCheckedChange={() => handleToggleColumn(col.key)}
                />
                <label
                  htmlFor={`col-${col.key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {col.label}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-auto p-4 border-t bg-white">
        <Button className="w-full">Apply</Button>
      </div>
    </div>
  );
};

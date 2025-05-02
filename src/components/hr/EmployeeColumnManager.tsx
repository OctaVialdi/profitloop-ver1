
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

// Define a consistent column structure type
export type EmployeeColumnState = {
  name: boolean;
  email: boolean;
  branch: boolean;
  organization: boolean;
  jobPosition: boolean;
  jobLevel: boolean;
  employmentStatus: boolean;
  joinDate: boolean;
  endDate: boolean;
  signDate: boolean;
  resignDate: boolean;
  barcode: boolean;
  birthDate: boolean;
  birthPlace: boolean;
  address: boolean;
  mobilePhone: boolean;
  religion: boolean;
  gender: boolean;
  maritalStatus: boolean;
}

// Define column order type
export type EmployeeColumnOrder = Array<keyof EmployeeColumnState>;

interface ColumnManagerProps {
  columns: EmployeeColumnState;
  columnOrder: EmployeeColumnOrder;
  onColumnChange: (columns: EmployeeColumnState) => void;
  onColumnOrderChange: (order: EmployeeColumnOrder) => void;
}

export const EmployeeColumnManager: React.FC<ColumnManagerProps> = ({ 
  columns, 
  columnOrder, 
  onColumnChange, 
  onColumnOrderChange 
}) => {
  const handleToggleColumn = (name: keyof EmployeeColumnState) => {
    onColumnChange({
      ...columns,
      [name]: !columns[name],
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(columns).reduce((acc, key) => {
      acc[key as keyof EmployeeColumnState] = true;
      return acc;
    }, { ...columns });
    
    onColumnChange(allSelected);
  };

  const handleDragEnd = (result: any) => {
    // Drop outside the list
    if (!result.destination) {
      return;
    }

    // Reorder column order
    const newColumnOrder = [...columnOrder];
    const [movedItem] = newColumnOrder.splice(result.source.index, 1);
    newColumnOrder.splice(result.destination.index, 0, movedItem);
    
    onColumnOrderChange(newColumnOrder);
  };

  // Convert columns into a more organized structure for rendering
  const columnGroups = [
    {
      title: "Basic Information",
      id: "basic",
      columns: [
        { key: "name" as keyof EmployeeColumnState, label: "Employee name" },
        { key: "email" as keyof EmployeeColumnState, label: "Email" },
        { key: "branch" as keyof EmployeeColumnState, label: "Branch" },
        { key: "organization" as keyof EmployeeColumnState, label: "Organization" },
      ]
    },
    {
      title: "Job Information",
      id: "job",
      columns: [
        { key: "jobPosition" as keyof EmployeeColumnState, label: "Job position" },
        { key: "jobLevel" as keyof EmployeeColumnState, label: "Job level" },
        { key: "employmentStatus" as keyof EmployeeColumnState, label: "Employment status" },
      ]
    },
    {
      title: "Dates",
      id: "dates",
      columns: [
        { key: "joinDate" as keyof EmployeeColumnState, label: "Join date" },
        { key: "endDate" as keyof EmployeeColumnState, label: "End date" },
        { key: "signDate" as keyof EmployeeColumnState, label: "Sign date" },
        { key: "resignDate" as keyof EmployeeColumnState, label: "Resign date" },
      ]
    },
    {
      title: "Personal Information",
      id: "personal",
      columns: [
        { key: "barcode" as keyof EmployeeColumnState, label: "Barcode" },
        { key: "birthDate" as keyof EmployeeColumnState, label: "Birth date" },
        { key: "birthPlace" as keyof EmployeeColumnState, label: "Birth place" },
        { key: "address" as keyof EmployeeColumnState, label: "Address" },
        { key: "mobilePhone" as keyof EmployeeColumnState, label: "Mobile phone" },
        { key: "religion" as keyof EmployeeColumnState, label: "Religion" },
        { key: "gender" as keyof EmployeeColumnState, label: "Gender" },
        { key: "maritalStatus" as keyof EmployeeColumnState, label: "Marital status" },
      ]
    }
  ];

  // Get all column definitions in a flat array
  const allColumns = columnGroups.flatMap(group => group.columns);

  return (
    <div className="h-full max-h-[500px] overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">MANAGE COLUMN</h3>
          <Button variant="ghost" className="text-blue-600 text-sm" onClick={handleSelectAll}>
            Select all
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {columnGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">{group.title}</h4>
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

          <div className="pt-4 border-t">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Column Order</h4>
            <p className="text-xs text-gray-500 mb-4">Drag and drop to change the order of columns in the table</p>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable-columns">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-1 border rounded-md p-2"
                  >
                    {columnOrder
                      .filter(colKey => columns[colKey]) // Only show selected columns
                      .map((colKey, index) => {
                        // Find column definition to get label
                        const column = allColumns.find(c => c.key === colKey);
                        if (!column) return null;
                        
                        return (
                          <Draggable key={colKey} draggableId={colKey} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center p-2 bg-gray-50 rounded border"
                              >
                                <div {...provided.dragHandleProps} className="mr-2">
                                  <GripVertical size={16} className="text-gray-500" />
                                </div>
                                <span className="text-sm">{column.label}</span>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </ScrollArea>
      
      <div className="mt-auto p-4 border-t bg-white">
        <Button className="w-full text-sm">Apply</Button>
      </div>
    </div>
  );
};

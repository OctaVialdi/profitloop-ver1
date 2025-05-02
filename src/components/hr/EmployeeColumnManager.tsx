
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoveVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ColumnKey, ColumnDisplayInfo } from './employee-list/types';

// Define a consistent column structure type
export type EmployeeColumnState = {
  [key in ColumnKey]?: boolean;
};

interface ColumnManagerProps {
  columns: EmployeeColumnState;
  onColumnChange: (columns: EmployeeColumnState) => void;
  columnOrder: ColumnKey[];
  onColumnOrderChange: (order: ColumnKey[]) => void;
}

export const EmployeeColumnManager: React.FC<ColumnManagerProps> = ({ 
  columns, 
  onColumnChange,
  columnOrder,
  onColumnOrderChange
}) => {
  const handleToggleColumn = (name: ColumnKey) => {
    onColumnChange({
      ...columns,
      [name]: !columns[name],
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(columns).reduce((acc, key) => {
      acc[key as ColumnKey] = true;
      return acc;
    }, { ...columns });
    
    onColumnChange(allSelected);
  };

  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If position didn't change
    if (sourceIndex === destinationIndex) {
      return;
    }

    const newColumnOrder = Array.from(columnOrder);
    const [removed] = newColumnOrder.splice(sourceIndex, 1);
    newColumnOrder.splice(destinationIndex, 0, removed);

    onColumnOrderChange(newColumnOrder);
  };

  // Convert columns into a more organized structure for rendering
  const columnGroups: { title: string, columns: ColumnDisplayInfo[] }[] = [
    {
      title: "Basic Information",
      columns: [
        { key: "name", label: "Employee name", group: "Basic Information" },
        { key: "email", label: "Email", group: "Basic Information" },
        { key: "branch", label: "Branch", group: "Basic Information" },
        { key: "parentBranch", label: "Parent branch", group: "Basic Information" },
        { key: "organization", label: "Organization", group: "Basic Information" },
        { key: "sbu", label: "SBU", group: "Basic Information" },
      ]
    },
    {
      title: "Job Information",
      columns: [
        { key: "jobPosition", label: "Job position", group: "Job Information" },
        { key: "jobLevel", label: "Job level", group: "Job Information" },
        { key: "employmentStatus", label: "Employment status", group: "Job Information" },
      ]
    },
    {
      title: "Dates",
      columns: [
        { key: "joinDate", label: "Join date", group: "Dates" },
        { key: "endDate", label: "End date", group: "Dates" },
        { key: "signDate", label: "Sign date", group: "Dates" },
        { key: "resignDate", label: "Resign date", group: "Dates" },
      ]
    },
    {
      title: "Personal Information",
      columns: [
        { key: "barcode", label: "Barcode", group: "Personal Information" },
        { key: "birthDate", label: "Birth date", group: "Personal Information" },
        { key: "birthPlace", label: "Birth place", group: "Personal Information" },
        { key: "address", label: "Address", group: "Personal Information" },
        { key: "mobilePhone", label: "Mobile phone", group: "Personal Information" },
        { key: "religion", label: "Religion", group: "Personal Information" },
        { key: "gender", label: "Gender", group: "Personal Information" },
        { key: "maritalStatus", label: "Marital status", group: "Personal Information" },
      ]
    }
  ];

  // We'll use this to get all columns in current order for drag and drop
  const allColumnsFlat = columnGroups.flatMap(group => group.columns);
  
  // Create a map for quick lookups
  const columnMap = allColumnsFlat.reduce((acc, col) => {
    acc[col.key] = col;
    return acc;
  }, {} as Record<ColumnKey, ColumnDisplayInfo>);

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
          {/* First show checkboxes by group for toggling visibility */}
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
          
          {/* Then show the reorder section for checked columns */}
          <div className="mt-6">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Column Order</h4>
            <p className="text-xs text-gray-500 mb-4">Drag and drop to reorder columns</p>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {columnOrder
                      .filter(key => columns[key]) // Only show visible columns
                      .map((key, index) => (
                        <Draggable key={key} draggableId={key} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center p-2 bg-gray-50 rounded border border-gray-200"
                            >
                              <MoveVertical className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">{columnMap[key]?.label || key}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
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

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoveVertical } from 'lucide-react';

// Define a consistent column structure type
export type EmployeeColumnState = {
  name: boolean;
  employeeId: boolean; // Added employeeId column
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
};

// Define a column order type 
export type ColumnOrder = Array<keyof EmployeeColumnState>;
interface ColumnManagerProps {
  columns: EmployeeColumnState;
  onColumnChange: (columns: EmployeeColumnState) => void;
  columnOrder: ColumnOrder;
  onOrderChange: (order: ColumnOrder) => void;
}
export const EmployeeColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onColumnChange,
  columnOrder,
  onOrderChange
}) => {
  const handleToggleColumn = (name: keyof EmployeeColumnState) => {
    onColumnChange({
      ...columns,
      [name]: !columns[name]
    });
  };
  const handleSelectAll = () => {
    const allSelected = Object.keys(columns).reduce((acc, key) => {
      acc[key as keyof EmployeeColumnState] = true;
      return acc;
    }, {
      ...columns
    });
    onColumnChange(allSelected);
  };
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(columnOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    onOrderChange(newOrder);
  };

  // Convert columns into a more organized structure for rendering
  const columnGroups = [{
    title: "Basic Information",
    columns: [{
      key: "name" as keyof EmployeeColumnState,
      label: "Employee name"
    }, {
      key: "employeeId" as keyof EmployeeColumnState,
      label: "Employee ID"
    },
    // Added employeeId column
    {
      key: "email" as keyof EmployeeColumnState,
      label: "Email"
    }, {
      key: "branch" as keyof EmployeeColumnState,
      label: "Branch"
    }, {
      key: "organization" as keyof EmployeeColumnState,
      label: "Organization"
    }]
  }, {
    title: "Job Information",
    columns: [{
      key: "jobPosition" as keyof EmployeeColumnState,
      label: "Job position"
    }, {
      key: "jobLevel" as keyof EmployeeColumnState,
      label: "Job level"
    }, {
      key: "employmentStatus" as keyof EmployeeColumnState,
      label: "Employment status"
    }]
  }, {
    title: "Dates",
    columns: [{
      key: "joinDate" as keyof EmployeeColumnState,
      label: "Join date"
    }, {
      key: "endDate" as keyof EmployeeColumnState,
      label: "End date"
    }, {
      key: "signDate" as keyof EmployeeColumnState,
      label: "Sign date"
    }, {
      key: "resignDate" as keyof EmployeeColumnState,
      label: "Resign date"
    }]
  }, {
    title: "Personal Information",
    columns: [{
      key: "barcode" as keyof EmployeeColumnState,
      label: "Barcode"
    }, {
      key: "birthDate" as keyof EmployeeColumnState,
      label: "Birth date"
    }, {
      key: "birthPlace" as keyof EmployeeColumnState,
      label: "Birth place"
    }, {
      key: "address" as keyof EmployeeColumnState,
      label: "Address"
    }, {
      key: "mobilePhone" as keyof EmployeeColumnState,
      label: "Mobile phone"
    }, {
      key: "religion" as keyof EmployeeColumnState,
      label: "Religion"
    }, {
      key: "gender" as keyof EmployeeColumnState,
      label: "Gender"
    }, {
      key: "maritalStatus" as keyof EmployeeColumnState,
      label: "Marital status"
    }]
  }];
  return <div className="h-full max-h-[500px] overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">MANAGE COLUMN</h3>
          <Button variant="ghost" className="text-blue-600 text-sm" onClick={handleSelectAll}>
            Select all
          </Button>
        </div>
      </div>
      
      

      <div className="p-4 border-t border-b">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Column Order</h4>
        <p className="text-xs text-gray-500 mb-3">
          Drag and drop to reorder visible columns
        </p>
        
        <ScrollArea className="h-[200px]">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {provided => <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {columnOrder.map((key, index) => {
                // Find the column in our groups to get the label
                let columnLabel = '';
                columnGroups.forEach(group => {
                  const found = group.columns.find(col => col.key === key);
                  if (found) columnLabel = found.label;
                });
                return <Draggable key={key} draggableId={key} index={index}>
                        {provided => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center justify-between p-2 bg-gray-50 rounded border cursor-move">
                            <div className="flex items-center gap-2">
                              <MoveVertical className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{columnLabel}</span>
                            </div>
                            <div>
                              <Checkbox checked={columns[key] || false} onCheckedChange={() => handleToggleColumn(key)} aria-label={`Toggle visibility for ${columnLabel}`} />
                            </div>
                          </div>}
                      </Draggable>;
              })}
                  {provided.placeholder}
                </div>}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </div>
      
      <div className="mt-auto p-4 bg-white">
        <Button className="w-full text-sm">Apply</Button>
      </div>
    </div>;
};
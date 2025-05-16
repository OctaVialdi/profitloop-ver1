import React, { useEffect, useState } from "react";
import { Users, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitialExpenseTypes, getAllowedExpenseTypes } from "./categoryExpenseTypeMap";
import { useOrganization } from "@/hooks/useOrganization";

interface DepartmentTypeSectionProps {
  department: string;
  setDepartment: (value: string) => void;
  expenseType: string;
  setExpenseType: (value: string) => void;
  departments: string[];
  departmentsLoading: boolean;
  validationErrors: Record<string, string>;
  selectedCategory?: string;
  categoryId?: string;
}

export const DepartmentTypeSection: React.FC<DepartmentTypeSectionProps> = ({
  department,
  setDepartment,
  expenseType,
  setExpenseType,
  departments,
  departmentsLoading,
  validationErrors,
  selectedCategory,
  categoryId
}) => {
  const { organization } = useOrganization();
  const [filteredExpenseTypes, setFilteredExpenseTypes] = useState<string[]>(
    selectedCategory ? getInitialExpenseTypes(selectedCategory) : ["Fixed", "Variable", "Operational", "Capital", "Non-Operational"]
  );
  
  useEffect(() => {
    // If we have a category ID and organization ID, fetch expense types from database
    if (selectedCategory && categoryId && organization?.id) {
      const fetchExpenseTypes = async () => {
        const types = await getAllowedExpenseTypes(selectedCategory, categoryId, organization.id);
        setFilteredExpenseTypes(types);
        
        // Reset expense type if current value is not in filtered list
        if (expenseType && !types.includes(expenseType)) {
          setExpenseType(types[0] || "");
        }
      };
      
      fetchExpenseTypes();
    } else if (selectedCategory) {
      // Otherwise use default mapping
      const defaultTypes = getInitialExpenseTypes(selectedCategory);
      setFilteredExpenseTypes(defaultTypes);
      
      // Reset expense type if current value is not in filtered list
      if (expenseType && !defaultTypes.includes(expenseType)) {
        setExpenseType(defaultTypes[0] || "");
      }
    }
  }, [selectedCategory, categoryId, organization?.id, expenseType, setExpenseType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Department */}
      <div className="space-y-2">
        <label className="text-base font-medium">
          Department<span className="text-red-500">*</span>
        </label>
        <Select 
          value={department} 
          onValueChange={(value) => setDepartment(value)}
        >
          <SelectTrigger className={cn(
            "h-[50px]",
            validationErrors.department && "border-red-500"
          )}>
            <Users className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {departmentsLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-departments" disabled>No departments found</SelectItem>
            )}
          </SelectContent>
        </Select>
        {validationErrors.department && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.department}</p>
        )}
      </div>

      {/* Expense Type */}
      <div className="space-y-2">
        <label className="text-base font-medium">
          Expense Type<span className="text-red-500">*</span>
        </label>
        <Select 
          value={expenseType} 
          onValueChange={(value) => setExpenseType(value)}
        >
          <SelectTrigger className={cn(
            "h-[50px]",
            validationErrors.expenseType && "border-red-500"
          )}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {filteredExpenseTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.expenseType && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.expenseType}</p>
        )}
      </div>
    </div>
  );
};

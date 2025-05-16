
import React, { useState, useEffect } from "react";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganization } from "@/hooks/useOrganization";
import { getAllowedExpenseTypes } from "./categoryExpenseTypeMap";

interface DepartmentTypeSectionProps {
  department: string;
  setDepartment: (value: string) => void;
  expenseType: string;
  setExpenseType: (value: string) => void;
  departments: { id: string, name: string }[];
  departmentsLoading: boolean;
  validationErrors: Record<string, string>;
  selectedCategory: string;
  categoryId?: string;
}

const DepartmentTypeSection: React.FC<DepartmentTypeSectionProps> = ({
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
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  const { organization } = useOrganization();
  
  // Fetch allowed expense types when category changes
  useEffect(() => {
    const loadExpenseTypes = async () => {
      if (selectedCategory && organization?.id) {
        const types = await getAllowedExpenseTypes(
          selectedCategory,
          categoryId || '',
          organization.id
        );
        setExpenseTypes(types);
        
        // If current type is not in the allowed types, reset it
        if (expenseType && !types.includes(expenseType)) {
          setExpenseType('');
        }
      } else {
        setExpenseTypes(["Fixed", "Variable", "Operational", "Capital", "Non-Operational"]);
      }
    };
    
    loadExpenseTypes();
  }, [selectedCategory, categoryId, organization?.id]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Department dropdown */}
      <FormItem>
        <Label htmlFor="department" className="flex items-center">
          Department<span className="text-red-500">*</span>
        </Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger id="department" className="w-full" disabled={departmentsLoading}>
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.department && (
          <p className="text-sm text-red-500">{validationErrors.department}</p>
        )}
      </FormItem>

      {/* Expense Type dropdown */}
      <FormItem>
        <Label htmlFor="expenseType" className="flex items-center">
          Expense Type<span className="text-red-500">*</span>
        </Label>
        <Select value={expenseType} onValueChange={setExpenseType}>
          <SelectTrigger id="expenseType" className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {expenseTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.expenseType && (
          <p className="text-sm text-red-500">{validationErrors.expenseType}</p>
        )}
      </FormItem>
    </div>
  );
};

export default DepartmentTypeSection;

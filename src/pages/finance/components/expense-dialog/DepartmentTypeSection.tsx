
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useExpenseTypeMappings } from "@/hooks/useExpenseTypeMappings";
import { useOrganization } from "@/hooks/useOrganization";
import { getExpenseTypesForCategory, setExpenseTypesForCategory } from "./categoryExpenseTypeMap";

interface DepartmentTypeSectionProps {
  department: string;
  setDepartment: (value: string) => void;
  expenseType: string;
  setExpenseType: (value: string) => void;
  departments: string[];
  departmentsLoading: boolean;
  validationErrors: Record<string, string>;
  selectedCategory: string;
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
  const { getExpenseTypesForCategory: fetchExpenseTypes } = useExpenseTypeMappings();
  const { organization } = useOrganization();
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExpenseTypes = async () => {
      if (!categoryId || !organization?.id) return;
        
      // First check if we have cached data
      const cachedTypes = getExpenseTypesForCategory(categoryId);
      if (cachedTypes && cachedTypes.length > 0) {
        setExpenseTypes(cachedTypes);
        return;
      }
      
      // If no cached data, fetch from API
      setLoading(true);
      try {
        const types = await fetchExpenseTypes(categoryId);
        setExpenseTypes(types);
        
        // Cache the result
        setExpenseTypesForCategory(categoryId, types);
      } catch (error) {
        console.error("Error loading expense types:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenseTypes();
  }, [categoryId, organization?.id, fetchExpenseTypes]);

  // Reset expense type when category changes
  useEffect(() => {
    if (categoryId) {
      setExpenseType('');
    }
  }, [categoryId, setExpenseType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-base font-medium">
          Department<span className="text-red-500">*</span>
        </label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className={cn(
            "h-[50px]",
            validationErrors.department && "border-red-500"
          )}>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departmentsLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : departments.length === 0 ? (
              <SelectItem value="no-departments" disabled>No departments found</SelectItem>
            ) : (
              departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {validationErrors.department && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.department}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium">
          Expense Type<span className="text-red-500">*</span>
        </label>
        <Select value={expenseType} onValueChange={setExpenseType} disabled={!selectedCategory}>
          <SelectTrigger className={cn(
            "h-[50px]",
            validationErrors.expenseType && "border-red-500"
          )}>
            <SelectValue placeholder={selectedCategory ? "Select expense type" : "Select a category first"} />
          </SelectTrigger>
          <SelectContent>
            {!selectedCategory ? (
              <SelectItem value="no-category" disabled>Select a category first</SelectItem>
            ) : loading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading expense types...</span>
              </div>
            ) : expenseTypes.length === 0 ? (
              <SelectItem value="no-types" disabled>No expense types found</SelectItem>
            ) : (
              expenseTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {validationErrors.expenseType && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.expenseType}</p>
        )}
      </div>
    </div>
  );
};


import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatUtils";
import { ExpenseCategory, Expense } from "@/hooks/useExpenses";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

interface ExpenseTableProps {
  loading: boolean;
  filteredExpenses: Expense[];
  categories: ExpenseCategory[];
  expenses: Expense[];
}

export function ExpenseTable({
  loading,
  filteredExpenses,
  categories,
  expenses,
}: ExpenseTableProps) {
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const handleStatusChange = (expenseId: string, newStatus: string) => {
    // In a real application, this would update the status in the database
    console.log(`Changing status of expense ${expenseId} to ${newStatus}`);
    
    // Show success toast
    toast({
      title: "Status updated",
      description: `Expense status has been updated to ${newStatus}`,
    });
    
    // Close the popover
    setEditingStatus(null);
  };

  const getStatusStyles = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return "bg-green-50 text-green-600";
      case 'fixed':
        return "bg-blue-50 text-blue-600";
      case 'variable':
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const statusOptions = ["Operational", "Fixed", "Variable"];

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Date</TableHead>
              <TableHead className="text-gray-600 font-medium">Category</TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[250px] w-1/3">Description</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Amount</TableHead>
              <TableHead className="text-gray-600 font-medium">Department</TableHead>
              <TableHead className="text-gray-600 font-medium">Type</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p>Loading expenses data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {filteredExpenses.length === 0 && expenses.length > 0 ? 
                    "No expenses found matching your filters." : 
                    "No expenses found. Add your first expense!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => {
                // Find category name
                const categoryName = categories.find(cat => cat.id === expense.category_id)?.name || 'Uncategorized';
                // Format date
                const formattedDate = new Date(expense.date).toLocaleDateString('id-ID', { 
                  day: '2-digit', month: 'short', year: 'numeric' 
                });
                
                return (
                  <TableRow key={expense.id} className="border-b hover:bg-gray-50">
                    <TableCell className="font-medium">{formattedDate}</TableCell>
                    <TableCell>{categoryName}</TableCell>
                    <TableCell className="min-w-[250px] w-1/3">{expense.description || "N/A"}</TableCell>
                    <TableCell className={`text-right font-medium`}>
                      {formatRupiah(expense.amount)}
                    </TableCell>
                    <TableCell>{expense.department || "N/A"}</TableCell>
                    <TableCell>{expense.expense_type || "N/A"}</TableCell>
                    <TableCell>
                      <Popover open={editingStatus === expense.id} onOpenChange={(open) => !open && setEditingStatus(null)}>
                        <PopoverTrigger asChild>
                          <button 
                            onClick={() => setEditingStatus(expense.id)}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                              getStatusStyles(expense.expense_type)
                            }`}>
                            {expense.expense_type || "N/A"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 w-auto" side="top">
                          <div className="flex flex-col gap-1">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                className={`w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                                  expense.expense_type === status ? "bg-gray-100 font-medium" : ""
                                }`}
                                onClick={() => handleStatusChange(expense.id, status)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination section */}
      <div className="p-4 border-t flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </>
  );
}

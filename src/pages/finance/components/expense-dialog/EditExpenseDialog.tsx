
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useExpenses, Expense } from "@/hooks/useExpenses";
import { useDepartments } from "@/hooks/useDepartments";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DateAmountSection,
  ReceiptUploadSection,
  CategorySection,
  DescriptionSection,
  DepartmentTypeSection,
  RecurringSection,
  DialogFooter
} from "./";

interface EditExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onSuccess?: () => void;
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  expense,
  onSuccess
}) => {
  // Form state
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [expenseType, setExpenseType] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const { categories, fetchCategories, addCategory, updateExpense } = useExpenses();
  const { departments, fetchDepartments, loading: departmentsLoading } = useDepartments();

  // Initialize form with expense data when it changes
  useEffect(() => {
    if (expense) {
      setDate(new Date(expense.date));
      setAmount(expense.amount.toString());
      setCategory(expense.category || getCategoryName(expense.category_id));
      setDescription(expense.description || "");
      setDepartment(expense.department || "");
      setExpenseType(expense.expense_type || "");
      setIsRecurring(expense.is_recurring || false);
      setRecurringFrequency(expense.recurring_frequency || "");
      
      if (expense.receipt_url) {
        setReceiptPreview(expense.receipt_url);
      } else {
        setReceiptPreview(null);
      }
    }
  }, [expense]);

  // Fetch categories and departments when component mounts
  useEffect(() => {
    fetchCategories();
    fetchDepartments();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!date) errors.date = "Date is required";
    if (!amount || amount === "0") errors.amount = "Amount is required and must be greater than 0";
    if (!category) errors.category = "Category is required";
    if (!department) errors.department = "Department is required";
    if (!expenseType) errors.expenseType = "Expense type is required";
    if (isRecurring && !recurringFrequency) errors.recurringFrequency = "Recurring frequency is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size should not exceed 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only image files and PDFs are allowed",
          variant: "destructive",
        });
        return;
      }
      
      setReceipt(file);
      
      // Create preview URL for the uploaded image
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setReceiptPreview(previewUrl);
      } else {
        // For PDFs or other file types, show a generic preview
        setReceiptPreview(null);
      }
      
      toast({
        title: "Receipt Uploaded",
        description: `File "${file.name}" successfully uploaded`,
      });
    }
  };

  const removeReceipt = () => {
    if (receiptPreview && !expense?.receipt_url) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceipt(null);
    setReceiptPreview(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || newCategoryName.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addCategory(newCategoryName);
    if (result) {
      setCategory(newCategoryName);
      setNewCategoryName("");
      setShowAddCategory(false);
      
      toast({
        title: "Success",
        description: `Category "${newCategoryName}" has been added`,
      });
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!expense?.id) {
      toast({
        title: "Error",
        description: "No expense ID found for updating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit expense update
      const result = await updateExpense(expense.id, {
        amount: Number(amount),
        date,
        category,
        description,
        department,
        expenseType,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        receipt: receipt || undefined
      });
      
      if (result) {
        // Close dialog and notify success
        onOpenChange(false);
        
        toast({
          title: "Success",
          description: "Expense has been updated successfully",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to update expense");
      }
    } catch (error: any) {
      console.error("Error updating expense:", error);
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to update expense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] aspect-square max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-lg font-semibold">Edit Expense</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="grid gap-4 px-6 py-4">
            {/* Date and Amount row */}
            <DateAmountSection
              date={date}
              setDate={setDate}
              amount={amount}
              handleAmountChange={handleAmountChange}
              validationErrors={validationErrors}
            />

            {/* Category with add new option */}
            <CategorySection
              category={category}
              setCategory={(value) => {
                setCategory(value);
                setValidationErrors({...validationErrors, category: ''});
              }}
              showAddCategory={showAddCategory}
              setShowAddCategory={setShowAddCategory}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              handleAddCategory={handleAddCategory}
              categories={categories}
              validationErrors={validationErrors}
            />

            {/* Department and Expense Type */}
            <DepartmentTypeSection
              department={department}
              setDepartment={(value) => {
                setDepartment(value);
                setValidationErrors({...validationErrors, department: ''});
              }}
              expenseType={expenseType}
              setExpenseType={(value) => {
                setExpenseType(value);
                setValidationErrors({...validationErrors, expenseType: ''});
              }}
              departments={departments}
              departmentsLoading={departmentsLoading}
              validationErrors={validationErrors}
              selectedCategory={category}
              categoryId={categories.find(c => c.name === category)?.id}
            />
            
            {/* Recurring Expense and Frequency */}
            <RecurringSection
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              recurringFrequency={recurringFrequency}
              setRecurringFrequency={(value) => {
                setRecurringFrequency(value);
                setValidationErrors({...validationErrors, recurringFrequency: ''});
              }}
              validationErrors={validationErrors}
            />

            {/* Description section */}
            <DescriptionSection 
              description={description}
              setDescription={setDescription}
            />

            {/* Receipt upload section */}
            <ReceiptUploadSection
              receipt={receipt}
              receiptPreview={receiptPreview}
              handleReceiptUpload={handleReceiptUpload}
              removeReceipt={removeReceipt}
            />
          </div>
        </ScrollArea>

        {/* Submit Button - Fixed at bottom */}
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onSubmit={handleSubmit} 
          label="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseDialog;

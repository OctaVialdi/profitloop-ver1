
import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useExpenses } from "@/hooks/useExpenses";
import { useDepartments } from "@/hooks/useDepartments";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DateAmountSection,
  ReceiptUploadSection,
  CategorySection,
  DescriptionSection,
  DepartmentTypeSection,
  RecurringSection
} from "./";

const AddExpenseDialog: React.FC = () => {
  // Form state
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [expenseType, setExpenseType] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { categories, fetchCategories, addCategory, addExpense } = useExpenses();
  const { departments, fetchDepartments, loading: departmentsLoading } = useDepartments();

  // Fetch categories and departments when component mounts
  useEffect(() => {
    fetchCategories();
    fetchDepartments();
  }, []);

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
    // Allow only numbers and format as needed
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }
      
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only image files and PDFs are allowed");
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
      
      toast.success(`File "${file.name}" successfully uploaded`);
    }
  };

  const removeReceipt = () => {
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceipt(null);
    setReceiptPreview(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || newCategoryName.trim() === "") {
      toast.error("Please enter a category name");
      return;
    }
    
    const result = await addCategory(newCategoryName);
    if (result) {
      setCategory(newCategoryName);
      setNewCategoryName("");
      setShowAddCategory(false);
      
      toast.success(`Category "${newCategoryName}" has been added`);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setAmount("");
    setCategory("");
    setDescription("");
    setDepartment("");
    setExpenseType("");
    setIsRecurring(false);
    setRecurringFrequency("");
    setValidationErrors({});
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceipt(null);
    setReceiptPreview(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Submitting expense with data:", {
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
      
      // Submit expense
      const result = await addExpense({
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
        // Reset form and close dialog
        resetForm();
        setIsOpen(false);
        
        toast.success("Expense has been added successfully");
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error: any) {
      console.error("Error submitting expense:", error);
      setIsSubmitting(false);
      
      toast.error(error.message || "Failed to add expense");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B5CF6] hover:bg-[#7c4ff1]">Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Expense</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Date and Amount row */}
          <DateAmountSection
            date={date}
            setDate={setDate}
            amount={amount}
            handleAmountChange={handleAmountChange}
            validationErrors={validationErrors}
          />

          {/* Receipt upload section */}
          <ReceiptUploadSection
            receipt={receipt}
            receiptPreview={receiptPreview}
            handleReceiptUpload={handleReceiptUpload}
            removeReceipt={removeReceipt}
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

          {/* Description */}
          <DescriptionSection 
            description={description}
            setDescription={setDescription}
          />

          {/* Department and Expense Type row */}
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

          {/* Submit Button */}
          <Button 
            className="h-[60px] bg-[#8B5CF6] hover:bg-[#7c4ff1] mt-4" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;

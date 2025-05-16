
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useExpenses } from "@/hooks/useExpenses";
import { useDepartments } from "@/hooks/useDepartments";
import { getAllowedExpenseTypes, clearExpenseTypeCache } from "../categoryExpenseTypeMap";
import { useOrganization } from "@/hooks/useOrganization";

export interface ExpenseFormState {
  date: Date;
  amount: string;
  category: string;
  description: string;
  department: string;
  expenseType: string;
  isRecurring: boolean;
  recurringFrequency: string;
  receipt: File | null;
  receiptPreview: string | null;
  newCategoryName: string;
  showAddCategory: boolean;
  validationErrors: Record<string, string>;
}

export const useExpenseForm = () => {
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
  const [allowedExpenseTypes, setAllowedExpenseTypes] = useState<string[]>([]);

  const { toast } = useToast();
  const { organization } = useOrganization();
  const { categories, fetchCategories, addCategory, addExpense } = useExpenses();
  const { departments, fetchDepartments, loading: departmentsLoading } = useDepartments();

  // Fetch categories and departments when component mounts
  useEffect(() => {
    fetchCategories();
    fetchDepartments();
  }, []);

  // Update allowed expense types when category changes
  useEffect(() => {
    const updateExpenseTypes = async () => {
      if (category && organization?.id) {
        const categoryObj = categories.find(c => c.name === category);
        if (categoryObj) {
          const types = await getAllowedExpenseTypes(
            category, 
            categoryObj.id,
            organization.id
          );
          setAllowedExpenseTypes(types);
          
          // Reset expense type if current one is not allowed
          if (expenseType && !types.includes(expenseType)) {
            setExpenseType('');
          }
        }
      } else {
        setAllowedExpenseTypes(["Fixed", "Variable", "Operational", "Capital", "Non-Operational"]);
      }
    };
    
    updateExpenseTypes();
  }, [category, categories, organization?.id]);

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
    if (receiptPreview) {
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
    
    const result = await addCategory(newCategoryName.trim(), "");
    if (result) {
      setCategory(newCategoryName);
      setNewCategoryName("");
      setShowAddCategory(false);
      
      // Clear cache to ensure we get fresh data after adding a new category
      clearExpenseTypeCache();
      
      toast({
        title: "Success",
        description: `Category "${newCategoryName}" has been added`,
      });
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
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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
        
        toast({
          title: "Success",
          description: "Expense has been added successfully",
        });
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error: any) {
      console.error("Error submitting expense:", error);
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const formState = {
    date,
    amount,
    category,
    description,
    department,
    expenseType,
    isRecurring,
    recurringFrequency,
    receipt,
    receiptPreview,
    newCategoryName,
    showAddCategory,
    validationErrors,
  };

  const formSetters = {
    setDate,
    setAmount: handleAmountChange,
    setCategory,
    setDescription,
    setDepartment,
    setExpenseType,
    setIsRecurring,
    setRecurringFrequency,
    setNewCategoryName,
    setShowAddCategory,
  };

  const formHandlers = {
    handleReceiptUpload,
    removeReceipt,
    handleAddCategory,
    handleSubmit,
  };

  return {
    formState,
    formSetters,
    formHandlers,
    isOpen,
    setIsOpen,
    isSubmitting,
    categories,
    departments,
    departmentsLoading,
    allowedExpenseTypes,
    validateForm,
    resetForm,
  };
};

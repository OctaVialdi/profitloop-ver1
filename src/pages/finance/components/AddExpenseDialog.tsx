import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, SlidersHorizontal, Check, UploadCloud, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Define expense types
const expenseTypes = [
  "Fixed",
  "Variable",
  "Operational"
];

const recurringFrequencies = [
  "Monthly",
  "Quarterly",
  "Yearly"
];

const AddExpenseDialog: React.FC = () => {
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

  const { toast } = useToast();
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
    
    const result = await addCategory(newCategoryName);
    if (result) {
      setCategory(newCategoryName); // Now directly using the name instead of ID
      setNewCategoryName("");
      setShowAddCategory(false);
      
      toast({
        title: "Success",
        description: `Category "${newCategoryName}" has been added`,
      });
    }
  };

  const deleteCategory = async (categoryName: string) => {
    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      // Confirm deletion
      if (!confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
        return;
      }

      const { data, error } = await supabase
        .from("expense_categories")
        .delete()
        .eq("name", categoryName)
        .eq("organization_id", organization.id);

      if (error) throw error;
      
      toast({
        title: "Category Deleted",
        description: `Category "${categoryName}" has been deleted successfully`,
      });
      
      await fetchCategories();
    } catch (error: any) {
      console.error("Error deleting expense category:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense category",
        variant: "destructive",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date picker */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Date<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-[50px]",
                      !date && "text-muted-foreground",
                      validationErrors.date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setValidationErrors({...validationErrors, date: ''});
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.date && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.date}</p>
              )}
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Amount (Rp)<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-[14px] text-gray-500">Rp</span>
                <Input 
                  type="text"
                  className={cn(
                    "pl-8 h-[50px]",
                    validationErrors.amount && "border-red-500"
                  )}
                  value={amount} 
                  onChange={handleAmountChange}
                  placeholder="0" 
                />
              </div>
              {validationErrors.amount && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.amount}</p>
              )}
            </div>
          </div>

          {/* Receipt upload section */}
          <div className="space-y-2">
            <label className="text-base font-medium">Receipt</label>
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              {receiptPreview ? (
                <div className="relative">
                  <img 
                    src={receiptPreview} 
                    alt="Receipt preview" 
                    className="max-h-[150px] mx-auto rounded-md object-contain" 
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-8 w-8 p-0"
                    onClick={removeReceipt}
                  >
                    ×
                  </Button>
                </div>
              ) : receipt && !receiptPreview ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="bg-gray-100 rounded-md p-4 text-center">
                    <p className="font-medium">{receipt.name}</p>
                    <p className="text-xs text-gray-500">{(receipt.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={removeReceipt}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload receipt image</p>
                  <label className="cursor-pointer">
                    <span className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md text-sm hover:bg-[#7c4ff1]">
                      Select File
                    </span>
                    <Input 
                      type="file" 
                      className="hidden" 
                      onChange={handleReceiptUpload}
                      accept="image/*,application/pdf"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Max file size: 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Category with add new option */}
          <div className="space-y-2">
            <label className="text-base font-medium">
              Category<span className="text-red-500">*</span>
            </label>
            {showAddCategory ? (
              <div className="flex gap-2">
                <Input 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  className="h-[50px]"
                />
                <Button onClick={handleAddCategory} className="h-[50px]">
                  <Check className="mr-1 h-4 w-4" /> Save
                </Button>
                <Button variant="ghost" onClick={() => setShowAddCategory(false)} className="h-[50px]">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Select 
                    value={category} 
                    onValueChange={(value) => {
                      setCategory(value);
                      setValidationErrors({...validationErrors, category: ''});
                    }}
                  >
                    <SelectTrigger className={cn(
                      "h-[50px] flex-1",
                      validationErrors.category && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>No categories found</SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <div key={cat.id} className="flex justify-between items-center px-2 py-1.5">
                            <SelectItem value={cat.name}>{cat.name}</SelectItem>
                            <Button 
                              variant="ghost" 
                              className="h-6 w-6 p-0 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCategory(cat.name);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                              </svg>
                            </Button>
                          </div>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowAddCategory(true)} className="h-[50px] px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {validationErrors.category && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-base font-medium">Description</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </span>
              <Textarea 
                className="pl-10 min-h-[160px]" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter expense description" 
              />
            </div>
          </div>

          {/* Department and Expense Type row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Department<span className="text-red-500">*</span>
              </label>
              <Select 
                value={department} 
                onValueChange={(value) => {
                  setDepartment(value);
                  setValidationErrors({...validationErrors, department: ''});
                }}
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
                onValueChange={(value) => {
                  setExpenseType(value);
                  setValidationErrors({...validationErrors, expenseType: ''});
                }}
              >
                <SelectTrigger className={cn(
                  "h-[50px]",
                  validationErrors.expenseType && "border-red-500"
                )}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.expenseType && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.expenseType}</p>
              )}
            </div>
          </div>

          {/* Recurring Expense */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                className="h-5 w-5 data-[state=checked]:bg-[#8B5CF6]" 
                checked={isRecurring} 
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)} 
              />
              <label 
                htmlFor="recurring" 
                className="text-base font-medium leading-none cursor-pointer"
              >
                Recurring Expense
              </label>
            </div>
            <p className="text-sm text-muted-foreground">This expense repeats at regular intervals</p>
          </div>

          {/* Recurring Frequency - only show when recurring is checked */}
          {isRecurring && (
            <div className="space-y-2">
              <label className="text-base font-medium">
                Recurring Frequency<span className="text-red-500">*</span>
              </label>
              <Select 
                value={recurringFrequency} 
                onValueChange={(value) => {
                  setRecurringFrequency(value);
                  setValidationErrors({...validationErrors, recurringFrequency: ''});
                }}
              >
                <SelectTrigger className={cn(
                  "h-[50px]",
                  validationErrors.recurringFrequency && "border-red-500"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {recurringFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.recurringFrequency && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.recurringFrequency}</p>
              )}
            </div>
          )}

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
